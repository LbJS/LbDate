
export interface MomentLike {
  clone: () => MomentLike
  valueOf: () => number
  toDate: (this: MomentLike) => Date
  toJSON: () => string
}

export interface InternalMomentLike extends MomentLike {
  _d: Date
  _i?: Date
  _isAMomentObject: boolean
  _l?: string
  _f?: string
  _strict?: boolean
  _useUTC?: boolean
  _isUTC?: boolean
}
