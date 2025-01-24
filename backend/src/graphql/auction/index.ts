import { mutation } from './mutation'
import { queries } from './queries'
import { resolvers } from './resolvers'
import { typedef } from './typedef'
import { subscriptions } from './Subscription '

export const Auction = {
    typedef,
    queries,
    mutation,
    resolvers,
    subscriptions
}
