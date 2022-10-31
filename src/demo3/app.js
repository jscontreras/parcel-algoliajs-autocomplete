/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';
import '@algolia/autocomplete-theme-classic';

const appId = '8KPBITCG1A';
const apiKey = '8b8fb541d51a59dc26e5eef54c45b3ea';
const indexName = 'production_deals';
const querySuggestionsIndex = 'production_deals_query_suggestions';

const searchClient = algoliasearch(appId, apiKey);

// Recnet Searches Plugin
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

autocomplete({
  container: '#autocomplete',
  plugins: [querySuggestionsPlugin, recentSearchesPlugin],
  placeholder: '',
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
      {
        sourceId: 'links',
        className: 'my-links',
        getItems() {
          return [
            {
              label: 'Twitter',
              url: 'https://twitter.com',
              img:
                'https://www.pngkey.com/png/full/2-27646_twitter-logo-png-transparent-background-logo-twitter-png.png',
            },
            {
              label: 'GitHub',
              url: 'https://github.com',
              img:
                'https://1000logos.net/wp-content/uploads/2021/05/GitHub-logo.png',
            },
          ];
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          header() {
            return 'Amazing Logos';
          },
          item({ item }) {
            return (
              <div className="aa-ItemWrapper custom-source__container">
                <a className="custom-source__a" href={item.url}>
                  <img
                    src={item.img}
                    alt={item.label}
                    className="custom-source__img"
                  />
                </a>
              </div>
            );
          },
          noResults() {
            return 'No matching Amazing LINKS.';
          },
        },
      },
    ];
  },
});
