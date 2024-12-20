/**
 * Base interface for all quantum pattern manipulation commands.
 * Follows Command pattern to enable undo/redo functionality
 * and maintain quantum state consistency.
 */
export interface BaseCommand {
    /**
     * Execute the command, performing pattern transformations
     * and maintaining state in Milvus.
     */
    execute(): Promise<void>;

    /**
     * Undo the command, reverting pattern state while
     * maintaining quantum coherence.
     */
    undo(): Promise<void>;

    /**
     * Retrieves the current state of the command execution.
     * Useful for visualization updates.
     */
    getState(): Promise<{
        pattern?: any;
        patternId?: number | null;
        visualizationData?: number[][][] | null;
        [key: string]: any;
    }>;
}
