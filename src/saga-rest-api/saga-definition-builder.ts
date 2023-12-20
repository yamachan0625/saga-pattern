import { SagaProcessor } from './saga-processor';

export type Command<P = any, RES = void> = (payload?: P) => Promise<RES>;

export type SagaDefinition = {
  stepName: string;
  forward: Command;
  compensation?: Command;
};

export class SagaDefinitionBuilder {
  index: number | null = null;
  sagaDefinitions: SagaDefinition[] = [];

  setSagaDefinition(sagaDefinition: SagaDefinition) {
    this.index = this.index === null ? 0 : this.index + 1;
    this.sagaDefinitions = [...this.sagaDefinitions, sagaDefinition];
    return this;
  }

  async build(): Promise<SagaProcessor> {
    const sagaProcessor = new SagaProcessor(this.sagaDefinitions);
    return sagaProcessor;
  }
}
