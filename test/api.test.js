import { join } from 'path';
import { readFileSync } from 'fs';
import { assert } from 'chai';
import { generateReport } from '../src/lib/index';


const defaultDir = process.cwd();
const changeDir = (directory) => () => process.chdir(directory);
const restoreDir = changeDir(defaultDir);
const sampleAppDir = changeDir(
  join(__dirname, './dummies/sample-app'),
);


const sampleConfigDir = join(__dirname, './dummies/');
const getTestConfig = (configID) => JSON.parse(readFileSync(`${sampleConfigDir}/${configID}.json`, { encoding: 'utf8' }));


describe('API integrations', () => {
  afterEach(restoreDir);

  // TODO blocked by https://github.com/ominestre/rotten-deps/issues/3
  xit('Should generate a report using a config with only rules', async () => {
    sampleAppDir();
    const config = getTestConfig('rules-only-config');
    const maybe = await generateReport(config);

    assert.isNotTrue(maybe.isError(), 'Maybe wrapper should not contain an error');

    const results = maybe.flatten();
    const leftPadLOL = results.filter(x => x.name === 'left-pad')[0];

    assert.equal(leftPadLOL.name, 'left-pad');
    assert.equal(leftPadLOL.current, '1.2.0');
    assert.isTrue(leftPadLOL.daysOutdated < 9000, 'Days Outdated should be less than 9000');
    assert.isFalse(leftPadLOL.isOutdated, 'left-pad should not be flagged as outdated');
  });

  /*  Sitting on this one because you should just be using npm or yarn outdated.
      Not sure I want to support this scenario */
  xit('Could generate a report without config');
  xit('Should generate a report using only global settings and no rules');
});