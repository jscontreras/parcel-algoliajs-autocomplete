/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const indexName = 'instant_search';

const searchClient = algoliasearch(appId, apiKey);

return;

autocomplete({
  container: '#autocomplete',
  placeholder: 'My Placeholder Text',
  getSources({ query }) {
    return [
      {
        sourceId: 'items',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName,
                query,
              },
            ],
          });
        },
        templates: {
          item({ item, components }) {
            return (
              <div class="aa-ItemWrapper">
                <div class="aa-ItemContent">
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                      <components.Highlight hit={item} attribute="name" />
                    </div>
                  </div>
                </div>
              </div>
            );
          },
          noResults() {
            return 'No matching items.';
          },
        },
      },
    ];
  },
});
