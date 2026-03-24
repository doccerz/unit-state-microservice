const unitObjectShape = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    metadata: { type: 'object', nullable: true },
  },
  additionalProperties: false,
}

export const createUnitBody = {
  oneOf: [
    unitObjectShape,
    {
      type: 'array',
      items: unitObjectShape,
      minItems: 1,
    },
  ],
}

export const patchUnitBody = {
  type: 'object',
  properties: {
    status: { type: 'boolean' },
    metadata: { type: 'object', nullable: true },
  },
  anyOf: [{ required: ['status'] }, { required: ['metadata'] }],
  additionalProperties: false,
}

export const unitParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
}

export const listUnitsQuery = {
  type: 'object',
  required: ['status'],
  properties: {
    status: { type: 'boolean' },
  },
  additionalProperties: false,
}

export const unitResponse = {
  type: 'object',
  required: ['id', 'status'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    status: { type: 'boolean' },
    metadata: { type: 'object', nullable: true, additionalProperties: true },
  },
}
