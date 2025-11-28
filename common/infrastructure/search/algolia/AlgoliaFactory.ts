import {Algoliasearch, algoliasearch, SearchClient} from 'algoliasearch';
import {injectable} from 'inversify';

@injectable()
export class AlgoliaFactory {
    private client: SearchClient | null = null;

    constructor(
        private appId: string,
        private apiKey: string
    ) {}

    getClient(): SearchClient {
        if (this.client) return this.client;
        this.client = this.createClient(this.appId, this.apiKey);
        return this.client;
    }
    createClient(appId: string, apiKey: string) {
        return algoliasearch(appId, apiKey);
    }
}
