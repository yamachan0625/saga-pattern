import { SagaDefinitionBuilder } from './saga-definition-builder';

const run = async () => {
  const sagaDefinitionBuilder = new SagaDefinitionBuilder()
    .setSagaDefinition({
      stepName: 'FlightBookingService',
      forward: async () => {
        console.log('STEP1 FORWARD');
        throw new Error('aaa');
      },
      compensation: async () => {
        console.log('STEP1 COMPENSATION');
      },
    })
    .setSagaDefinition({
      stepName: 'HotelBookingService',
      forward: async () => {
        console.log('STEP2 FORWARD');
      },
      compensation: async () => {
        console.log('STEP2 COMPENSATION');
        throw new Error('aaaaaaaaaaa');
      },
    })
    .setSagaDefinition({
      stepName: 'PaymentService',
      forward: async () => {
        console.log('STEP3 FORWARD');
        throw new Error('aaaaaaaaaaa');
      },
      compensation: async () => {
        console.log('STEP3 COMPENSATION');
      },
    });

  const sagaProcessor = await sagaDefinitionBuilder.build();
  sagaProcessor.start({ id: 1 });
};

run();
