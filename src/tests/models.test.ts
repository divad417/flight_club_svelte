import * as m from '../lib/models';

describe('userDefaults', () => {
    test.each
    it('should have property: id', () => {
        expect(m.userDefaults).toHaveProperty('id')
    })
    it('should have propery: name', () => {
        expect(m.userDefaults).toHaveProperty('name')
    })
})