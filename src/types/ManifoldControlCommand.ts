import { CommandParams } from './CommandParams';

export type CommandType = 'create' | 'merge' | 'evolve' | 'resonate' | 'collapse';

export interface ManifoldControlCommand {
    type: CommandType;
    params: CommandParams;
}
