import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LoancraftBe from '../lib/loancraft-be-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LoancraftBe.LoancraftBeStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
