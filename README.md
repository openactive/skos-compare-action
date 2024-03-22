# skos-compare-action
GitHub Action to compare SKOS files, used by https://github.com/openactive/activity-list

## Inputs

### `new_json_file`

**Required** New JSON-LD SKOS file path.

### `old_json_file`

**Required** Old JSON-LD SKOS file path.

## Outputs

### `hasChanges`

"true" or "false", indicating if the SKOS file has changed

### `changeDescription`

Human-readable list of the prefLabels that have changed


## Example usage

```
uses: openactive/skos-compare-action@main
with:
  new_json_file: './activity-list-updated.jsonld'
  old_json_file: './activity-list.jsonld'
```
