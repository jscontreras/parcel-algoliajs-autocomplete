/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import insightsClient from 'search-insights';
import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const indexName = 'instant_search';
const querySuggestionsIndex = 'instant_search_demo_query_suggestions';

insightsClient('init', {
  appId,
  apiKey,
  useCookie: false,
  userToken: 'ma-user-999',
});
// const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
//   insightsClient,
//   onActive({ insights, insightsEvents, item, state, event }) {
//     insightsEvents.forEach((insightsEvent) => {
//       // Assuming you've initialized the Segment script
//       // and identified the current user already
//       console.log(
//         'SEGMENT (ACTIVE) Event Forwarding',
//         insightsEvents,
//         insights
//       );
//       // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//     });
//   },
//   onItemsChange({ insights, insightsEvents, item, state, event }) {
//     // Assuming you've initialized the Segment script
//     // and identified the current user already
//     console.log('SEGMENT (CHANGE) Event Forwarding', insightsEvents, insights);
//     // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//   },
//   onSelect({ insights, insightsEvents, item, state, event }) {
//     // Assuming you've initialized the Segment script
//     // and identified the current user already
//     console.log(
//       'SEGMENT (SELECT) Event Forwarding',
//       insightsEvents,
//       insights,
//       item
//     );
//     // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//   },
// });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

const searchClient = algoliasearch(appId, apiKey);

// Recent Searches Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});

// Query Suggestion Plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: querySuggestionsIndex,
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ setIsOpen }) {
        setIsOpen(true);
      },
    };
  },
  getSearchParams({ state }) {
    return {
      query: state.query,
      hitsPerPage: 2,
    };
  },
});

// Autcomplete Initialization
autocomplete({
  openOnFocus: false,
  container: '#autocomplete',
  debug: true,
  plugins: [
    querySuggestionsPlugin,
    recentSearchesPlugin,
    algoliaInsightsPlugin,
  ],
  placeholder: 'Search Products',
  getSources({ query }) {
    return [
      {
        sourceId: 'autocomplete',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName,
                query,
                params: {
                  clickAnalytics: true,
                },
              },
            ],
          });
        },
        templates: {
          item({ item, components }) {
            return (
              <div className="aa-ItemWrapper">
                <div className="aa-ItemContent">
                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
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
