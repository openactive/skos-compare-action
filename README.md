# skos-compare-action
GitHub Action to compare SKOS files, used by https://github.com/openactive/skos-vocabulary-workflows.

## Inputs

### `new_jsonld_file`

**Required** New JSON-LD SKOS file path.

### `old_jsonld_file`

**Required** Old JSON-LD SKOS file path.

## Outputs

### `hasChanges`

Boolean indicating if the SKOS file has changed

### `changeDescription`

Human-readable list of the prefLabels that have changed


## Example usage

```
uses: openactive/skos-compare-action@main
with:
  new_jsonld_file: './activity-list-updated.jsonld'
  old_jsonld_file: './activity-list.jsonld'
```
