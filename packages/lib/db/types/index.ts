import { Card, CardEdition, CardSet, Edition } from "../schema";

export type NewSet = typeof CardSet.$inferInsert;
export type NewEdition = typeof Edition.$inferInsert;
export type NewCard = typeof Card.$inferInsert;
export type NewCardEdition = typeof CardEdition.$inferInsert;
