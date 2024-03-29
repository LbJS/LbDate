import { lbDate as lbDate_type, TimeZoneOptions } from 'lbdate'
import moment_type from 'moment'

describe('LbDate run():', () => {

  let lbDate: typeof lbDate_type
  let moment: typeof moment_type
  const dateString = '2000-01-01T00:00:00.000Z'

  beforeEach(async () => {
    const provider = await import('module-provider')
    lbDate = provider.lbDate
    moment = provider.moment
  })

  it('should return serialized date with timezone offset and three decimal digits precision, if no options were provided.', () => {
    let dateStringResult: string | undefined
    let momentDateStringResult: string | undefined
    lbDate().run(() => {
      dateStringResult = new Date(dateString).toJSON()
      momentDateStringResult = moment(new Date(dateString)).toJSON()
    }, moment)
    const expectedDateString = '2000-01-01T02:00:00.000+02:00'
    expect(dateStringResult).toBe(expectedDateString)
    expect(momentDateStringResult).toBe(expectedDateString)
  })

  it('(object) should return serialized date with timezone offset and three decimal digits precision, if no options were provided.', () => {
    let dateStringResult: string | undefined
    let momentDateStringResult: string | undefined
    lbDate.run(() => {
      dateStringResult = new Date(dateString).toJSON()
      momentDateStringResult = moment(new Date(dateString)).toJSON()
    }, moment)
    const expectedDateString = '2000-01-01T02:00:00.000+02:00'
    expect(dateStringResult).toBe(expectedDateString)
    expect(momentDateStringResult).toBe(expectedDateString)
  })

  it('should return serialized date with +05:00 timezone offset, if timezone option is set to manual and manual timezone offset is set to -300.', () => {
    let dateStringResult: string | undefined
    let momentDateStringResult: string | undefined
    lbDate({
      timezone: TimeZoneOptions.manual,
      manualTimeZoneOffset: -300
    }).run(() => {
      dateStringResult = new Date(dateString).toJSON()
      momentDateStringResult = moment(new Date(dateString)).toJSON()
    }, moment)
    const expectedDateString = '2000-01-01T05:00:00.000+05:00'
    expect(dateStringResult).toBe(expectedDateString)
    expect(momentDateStringResult).toBe(expectedDateString)
  })

  // tslint:disable-next-line: max-line-length
  it('should return serialized date with timezone offset and one decimal digit precision, if option precision was provided with value of 1.', () => {
    let dateStringResult: string | undefined
    let momentDateStringResult: string | undefined
    lbDate({
      precision: 1
    }).run(() => {
      dateStringResult = new Date(dateString).toJSON()
      momentDateStringResult = moment(new Date(dateString)).toJSON()
    }, moment)
    const expectedDateString = '2000-01-01T02:00:00.0+02:00'
    expect(dateStringResult).toBe(expectedDateString)
    expect(momentDateStringResult).toBe(expectedDateString)
  })

  it('should return the serialized date.', () => {
    const dateStringResult = lbDate().run(() => new Date(dateString).toJSON())
    const expectedDateString = '2000-01-01T02:00:00.000+02:00'
    expect(dateStringResult).toBe(expectedDateString)
  })

  it('should throw after restoring LbDate made changes.', () => {
    let dateStringResult: string | void | undefined
    expect(() => {
      dateStringResult = lbDate().run(() => {
        throw new Error()
      })
    }).toThrow()
    expect(dateStringResult).not.toBeDefined()
    const expectedDateString = '2000-01-01T00:00:00.000Z'
    expect(new Date(dateString).toJSON()).toBe(expectedDateString)
  })

  it('should merge options with global configurations.', () => {
    lbDate({
      timezone: TimeZoneOptions.manual,
      manualTimeZoneOffset: 300
    }).init()
    let dateStringResult: string | void | undefined
    let momentDateStringResult: string | void | undefined
    lbDate({
      precision: 1
    }).run(() => {
      dateStringResult = new Date(dateString).toJSON()
      momentDateStringResult = moment(new Date(dateString)).toJSON()
    }, moment)
    const expectedDateString = '1999-12-31T19:00:00.0-05:00'
    expect(dateStringResult).toBe(expectedDateString)
    expect(momentDateStringResult).toBe(expectedDateString)
  })
})
