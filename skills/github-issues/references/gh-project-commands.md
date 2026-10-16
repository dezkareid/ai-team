# gh Commands for the Project

Variables used below:

```bash
OWNER=dezkareid
PROJECT=$(gh project list --owner "$OWNER" --format json --jq '.projects[] | select(.title=="Dezkareid Enterprise") | .number')
PROJECT_ID=$(gh project view "$PROJECT" --owner "$OWNER" --format json --jq '.id')
REPO=dezkareid/ai-team   # target repo
```

## Field and option IDs

```bash
# All fields with their options (cache this for the session)
gh project field-list "$PROJECT" --owner "$OWNER" --format json

# One field ID / one option ID
FIELD_ID=$(gh project field-list "$PROJECT" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name=="Status") | .id')
OPTION_ID=$(gh project field-list "$PROJECT" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name=="Status") | .options[] | select(.name=="In Progress") | .id')
```

## Issues

```bash
# Create
URL=$(gh issue create --repo "$REPO" \
  --title "fix(seo): add missing meta tags to card pages" \
  --body-file /path/to/body.md \
  --label "type:fix")

# Add to project, capture the item ID
ITEM_ID=$(gh project item-add "$PROJECT" --owner "$OWNER" --url "$URL" --format json --jq '.id')

# Find the item ID of an existing issue
ITEM_ID=$(gh project item-list "$PROJECT" --owner "$OWNER" --limit 500 --format json \
  --jq ".items[] | select(.content.url==\"$URL\") | .id")

# Set a single-select field (one field per call)
gh project item-edit --project-id "$PROJECT_ID" --id "$ITEM_ID" \
  --field-id "$FIELD_ID" --single-select-option-id "$OPTION_ID"

# Set a date field
gh project item-edit --project-id "$PROJECT_ID" --id "$ITEM_ID" \
  --field-id "$TARGET_DATE_FIELD_ID" --date 2026-11-30

# Clear a field
gh project item-edit --project-id "$PROJECT_ID" --id "$ITEM_ID" --field-id "$FIELD_ID" --clear
```

Newer `gh` versions also accept names directly:
`gh project item-edit "$PROJECT" --owner "$OWNER" --url "$URL" --field Status --value "In Progress"`.
Check `gh project item-edit --help` for `--value` before using it.

```bash
# Edit title / labels / assignees
gh issue edit 42 --repo "$REPO" --title "perf(gallery): optimize image delivery" \
  --remove-label "type:fix" --add-label "type:perf"
gh issue edit 42 --repo "$REPO" --add-assignee @me
gh issue edit 42 --repo "$REPO" --remove-assignee someone

# Close / reopen / delete
gh issue close 42 --repo "$REPO" --reason completed        # or "not planned"
gh issue reopen 42 --repo "$REPO"
gh issue delete 42 --repo "$REPO" --yes                     # permanent, confirm first

# Remove from the board only
gh project item-delete "$PROJECT" --owner "$OWNER" --id "$ITEM_ID"
```

## Epics and sub-issues

```bash
# Node IDs
EPIC_NODE=$(gh issue view 10 --repo "$REPO" --json id --jq .id)
CHILD_NODE=$(gh issue view 12 --repo "$REPO" --json id --jq .id)

# Attach child
gh api graphql -f query='
mutation($parent:ID!,$child:ID!){
  addSubIssue(input:{issueId:$parent, subIssueId:$child}){ issue{ number } subIssue{ number } }
}' -f parent="$EPIC_NODE" -f child="$CHILD_NODE"

# Detach child
gh api graphql -f query='
mutation($parent:ID!,$child:ID!){
  removeSubIssue(input:{issueId:$parent, subIssueId:$child}){ issue{ number } }
}' -f parent="$EPIC_NODE" -f child="$CHILD_NODE"

# Progress + children
gh api graphql -f query='
query($owner:String!,$repo:String!,$n:Int!){
  repository(owner:$owner,name:$repo){
    issue(number:$n){
      title
      subIssuesSummary{ total completed percentCompleted }
      subIssues(first:100){ nodes{ number title state url } }
    }
  }
}' -f owner=dezkareid -f repo=ai-team -F n=10

# Check if an issue already has a parent
gh api graphql -f query='query($owner:String!,$repo:String!,$n:Int!){
  repository(owner:$owner,name:$repo){ issue(number:$n){ parent{ number title } } } }' \
  -f owner=dezkareid -f repo=ai-team -F n=12
```

Newer `gh` versions: `gh issue edit 10 --add-sub-issue 12` / `--remove-sub-issue 12`, and `gh issue view 10 --json subIssues,subIssuesSummary`.

## Listing

```bash
# Everything In Progress
gh project item-list "$PROJECT" --owner "$OWNER" --limit 500 --format json \
  --jq '.items[] | select(.status=="In Progress") | {n: .content.number, title, assignees, priority}'

# By type
gh project item-list "$PROJECT" --owner "$OWNER" --limit 500 --format json \
  --jq '.items[] | select(."commit Type"=="fix")'
```

Fields appear in item-list JSON keyed by name with only the first letter lowercased: `status`, `priority`, `product`, `size`, `"commit Type"`, `"target date"`. Fields without a value are omitted from the item.

## Body templates

Issue:

```markdown
## Context
Why this is needed / what's happening.

## Acceptance criteria
- [ ] ...

## Notes
Links, screenshots, related issues.
```

Epic:

```markdown
## Goal
The outcome this epic delivers.

## Scope
- ...

## Out of scope
- ...

## Success criteria
- [ ] ...
```

## Bootstrap (one-time project setup)

```bash
gh project create --owner dezkareid --title "Dezkareid Enterprise"
# "Type" is a reserved field name, hence "Commit Type"
gh project field-create "$PROJECT" --owner dezkareid --name "Commit Type" --data-type SINGLE_SELECT \
  --single-select-options "feat,fix,docs,style,refactor,perf,test,build,ci,chore,revert"
gh project field-create "$PROJECT" --owner dezkareid --name Priority --data-type SINGLE_SELECT --single-select-options "P0,P1,P2,P3"
gh project field-create "$PROJECT" --owner dezkareid --name Product --data-type SINGLE_SELECT \
  --single-select-options "personal-website,collecstory,ai-team,default"
gh project field-create "$PROJECT" --owner dezkareid --name Size --data-type SINGLE_SELECT --single-select-options "XS,S,M,L,XL"
gh project field-create "$PROJECT" --owner dezkareid --name "Target date" --data-type DATE
gh project link "$PROJECT" --owner dezkareid --repo "$REPO"

# Labels per repo
for t in feat fix docs style refactor perf test build ci chore revert; do
  gh label create "type:$t" --repo "$REPO" --force
done
gh label create epic --repo "$REPO" --color 3E4B9E --force
gh label create breaking-change --repo "$REPO" --color B60205 --force
```

The built-in `Status` field's options are replaced through GraphQL `updateProjectV2Field` with `singleSelectOptions` (Backlog, Todo, In Progress, In Review, Done), each with `name`, `color`, `description`.
