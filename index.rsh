'reach 0.1';

const Player = {
  getNum: Fun([], UInt),
  seeOutcome: Fun([UInt], Null),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
  });
  const Bob   = Participant('Bob', {
    ...Player,
  });
  deploy();

  Alice.only(() => {
    const handAlice = declassify(interact.getNum());
  });
  Alice.publish(handAlice);
  commit();

  Bob.only(() => {
    const handBob = declassify(interact.getNum());
  });
  Bob.publish(handBob);

  commit();

  each([Alice, Bob], () => {
    if(handAlice > handBob){
      interact.seeOutcome(2);
    }
    else if(handAlice < handBob){
      interact.seeOutcome(0);
    }
    else{
      interact.seeOutcome(1);
    }
  });
});