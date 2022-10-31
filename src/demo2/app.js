/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import insightsClient from 'search-insights';
import '@algolia/autocomplete-theme-classic';

const appId = '8KPBITCG1A';
const apiKey = '8b8fb541d51a59dc26e5eef54c45b3ea';
const indexName = 'production_deals';
const querySuggestionsIndex = 'production_deals_query_suggestions';

insightsClient('init', { appId, apiKey });
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onActive({ insights, insightsEvents, item, state, event }) {
    insightsEvents.forEach((insightsEvent) => {
      // Assuming you've initialized the Segment script
      // and identified the current user already
      console.log('SEGMENT (ACTIVE) Event Forwarding', insightsEvents, insights);
      // analytics.track('Product Browsed from Autocomplete', insightsEvent);
    });
  },
  onItemsChange({ insights, insightsEvents, item, state, event }) {
    // Assuming you've initialized the Segment script
    // and identified the current user already
    console.log('SEGMENT (CHANGE) Event Forwarding', insightsEvents, insights);
      // analytics.track('Product Browsed from Autocomplete', insightsEvent);
  },
  onSelect({ insights, insightsEvents, item, state, event }) {
    // Assuming you've initialized the Segment script
    // and identified the current user already
    console.log('SEGMENT (SELECT) Event Forwarding', insightsEvents, insights, item);
    // analytics.track('Product Browsed from Autocomplete', insightsEvent);
  },
});

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
});

// Autcomplete Initialization
autocomplete({
  openOnFocus: false,
  container: '#autocomplete',
  plugins: [algoliaInsightsPlugin],
  debug: true,
  //plugins: [querySuggestionsPlugin, recentSearchesPlugin],
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
                      <components.Highlight hit={item} attribute="title" />
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
