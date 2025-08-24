// Navbar.server.tsx （不写 'use client'）
import { NavbarClient } from './navbar';

export function Navbar() {
    const algolia_props = {
        appId: process.env.ALGOLIA_APP_ID!,
        indexName: process.env.ALGOLIA_INDEX!,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY!,
    };

    return <NavbarClient algoliaProps={algolia_props} />;
}
