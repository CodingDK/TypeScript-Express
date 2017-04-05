export interface IDatabase {
    openConnection(connectionString : string) : void;
    closeConnectionEvent(): void;
}
