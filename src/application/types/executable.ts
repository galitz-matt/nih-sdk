export type Executable<T> = {
    execute(): Promise<T>
};