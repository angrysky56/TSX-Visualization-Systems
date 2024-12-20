import { ManifoldControlCommand, CommandType } from '../../types/ManifoldControlCommand';
import { 
    CreateCommandParams,
    MergeCommandParams,
    EvolveCommandParams,
    ResonateCommandParams,
    CollapseCommandParams
} from '../../types/CommandParams';
import { BaseCommand } from './BaseCommand';
import { CreateCommand } from './CreateCommand';
import { MergeCommand } from './MergeCommand';
import { EvolveCommand } from './EvolveCommand';
import { ResonateCommand } from './ResonateCommand';
import { CollapseCommand } from './CollapseCommand';

export class CommandFactory {
    static createCommand(command: ManifoldControlCommand): BaseCommand {
        const commandType = command.type as CommandType;
        
        switch (commandType) {
            case 'create': {
                const params = command.params as CreateCommandParams;
                if (!params.patternType) {
                    throw new Error('Create command requires patternType parameter');
                }
                if (!params.symbol) {
                    throw new Error('Create command requires symbol parameter');
                }

                return new CreateCommand({
                    patternType: params.patternType,
                    symbol: params.symbol,
                    phase: params.phase ?? 0,
                    targetStates: params.targetStates || [], // Now properly typed as Array<any>
                    timeScale: params.timeScale ?? 1.0,
                    resonanceSymbols: params.resonanceSymbols ?? [],
                    amplitude: params.amplitude ?? 1.0,
                    probability: params.probability ?? 1.0
                });
            }
            
            case 'merge': {
                const params = command.params as MergeCommandParams;
                if (!params.sourceStates || !params.mergeStrategy) {
                    throw new Error('Merge command requires sourceStates and mergeStrategy parameters');
                }
                if (!params.symbol) {
                    throw new Error('Merge command requires symbol parameter');
                }

                return new MergeCommand({
                    sourceStates: params.sourceStates,
                    mergeStrategy: params.mergeStrategy,
                    symbol: params.symbol,
                    phase: params.phase ?? 0,
                    timeScale: params.timeScale ?? 1.0,
                    amplitude: params.amplitude ?? 1.0,
                    probability: params.probability ?? 1.0
                });
            }
            
            case 'evolve': {
                const params = command.params as EvolveCommandParams;
                if (!params.evolutionRate || !params.targetStates) {
                    throw new Error('Evolve command requires evolutionRate and targetStates parameters');
                }
                if (!params.symbol) {
                    throw new Error('Evolve command requires symbol parameter');
                }

                return new EvolveCommand({
                    evolutionRate: params.evolutionRate,
                    targetStates: params.targetStates,
                    symbol: params.symbol,
                    phase: params.phase ?? 0,
                    timeScale: params.timeScale ?? 1.0,
                    amplitude: params.amplitude ?? 1.0,
                    probability: params.probability ?? 1.0
                });
            }
            
            case 'resonate': {
                const params = command.params as ResonateCommandParams;
                if (!params.resonanceFrequency) {
                    throw new Error('Resonate command requires resonanceFrequency parameter');
                }
                if (!params.symbol) {
                    throw new Error('Resonate command requires symbol parameter');
                }

                return new ResonateCommand({
                    resonanceFrequency: params.resonanceFrequency,
                    resonanceSymbols: params.resonanceSymbols ?? [],
                    symbol: params.symbol,
                    phase: params.phase ?? 0,
                    timeScale: params.timeScale ?? 1.0,
                    amplitude: params.amplitude ?? 1.0,
                    probability: params.probability ?? 1.0
                });
            }
            
            case 'collapse': {
                const params = command.params as CollapseCommandParams;
                if (!params.collapseThreshold || !params.targetState) {
                    throw new Error('Collapse command requires collapseThreshold and targetState parameters');
                }
                if (!params.symbol) {
                    throw new Error('Collapse command requires symbol parameter');
                }

                return new CollapseCommand({
                    collapseThreshold: params.collapseThreshold,
                    targetState: params.targetState,
                    symbol: params.symbol,
                    phase: params.phase ?? 0,
                    timeScale: params.timeScale ?? 1.0,
                    amplitude: params.amplitude ?? 1.0,
                    probability: params.probability ?? 1.0
                });
            }
            
            default: {
                const exhaustiveCheck: never = commandType;
                throw new Error(`Unknown command type: ${exhaustiveCheck}`);
            }
        }
    }
}
