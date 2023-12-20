import { SagaDefinitionBuilder } from './saga/saga-definition-builder';

const run = async () => {
  const sagaDefinitionBuilder = new SagaDefinitionBuilder()
    .step('FlightBookingService')
    .onReply(async () => {
      // invoke Flight Booking Service API to reserve flight ticket
      console.log('STEP1 FORWARD');
      throw new Error('error');
    })
    .withCompensation(async () => {
      // invoke Flight Booking Service API to roll back previosly reserved ticket
      console.log('STEP1 COMPENSATION');
    })
    .step('HotelBookingService')
    .onReply(async () => {
      // invoke Hotel Booking API to book room
      console.log('STEP2 FORWARD');
    })
    .withCompensation(async () => {
      // invoke Hotel Booking API to roll back previously booked room
      console.log('STEP2 COMPENSATION');
    })
    .step('PaymentService')
    .onReply(async () => {
      // invoke Payment Service API to reserve money
      console.log('STEP3 FORWARD');
    })
    .withCompensation(async () => {
      // invoke Payment Service API to roll back previously reserved money
      console.log('STEP3 COMPENSATION');
    });

  const sagaProcessor = await sagaDefinitionBuilder.build();
  sagaProcessor.start({ id: 1 });
};

run();
