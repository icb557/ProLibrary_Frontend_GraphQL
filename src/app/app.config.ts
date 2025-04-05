import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokenInterceptor } from './utils/addToken.Interceptor';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
  provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes),
  importProvidersFrom(HttpClientModule),
  provideHttpClient(withInterceptors([addTokenInterceptor])), provideHttpClient(), provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: 'http://localhost:8080/graphql',
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
          mutate: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
        },
      };
    }),
  ]
};
