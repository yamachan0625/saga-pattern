import { SagaDefinition } from './saga-definition-builder';

export class SagaProcessor {
  constructor(private sagaDefinitions: SagaDefinition[]) {}

  private async runForward(index: number, payload: any) {
    const stepForward = this.sagaDefinitions[index].forward;

    try {
      await stepForward();

      const stepForwardwardIndex = index + 1;
      await this.checkStepForward(stepForwardwardIndex, payload);
    } catch (e) {
      const stepBackwardIndex = index - 1;
      await this.checkStepBackward(stepBackwardIndex, payload);
    }
  }

  private async runBackward(index: number, payload: any) {
    const definitions = this.sagaDefinitions[index];
    const stepBackward = definitions.compensation;

    try {
      if (stepBackward) {
        await stepBackward();
        await this.checkStepBackward(index - 1, payload);
      } else {
        await this.checkStepBackward(index - 1, payload);
      }
    } catch (error) {
      console.log(definitions.stepName);
    }
  }

  private async checkStepForward(index: number, payload: any) {
    if (index >= this.sagaDefinitions.length) {
      console.log('====> Saga finished and transaction successful');
      return;
    }

    await this.runForward(index, payload);
  }

  private async checkStepBackward(index: number, payload: any) {
    if (index < 0) {
      console.log('===> Saga finished and transaction rolled back');
      return;
    }

    await this.runBackward(index, payload);
  }

  async start(payload: any) {
    console.log('===> Saga started');
    await this.checkStepForward(0, payload);
  }
}
