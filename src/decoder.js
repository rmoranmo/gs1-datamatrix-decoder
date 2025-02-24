import moment from 'moment';

export function decodeGS1DataMatrix(code) {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid input: code must be a non-empty string');
  }

  // GS1 Application Identifiers
  const AI = {
    '01': { name: 'GTIN', length: 14 },
    '10': { name: 'BATCH/LOT', variableLength: true },
    '17': { name: 'USE BY OR EXPIRY', length: 6 },
    '21': { name: 'SERIAL', variableLength: true },
    '71': { name: 'NHRN - Spain CN', variableLength: true }
  };

  let position = 0;
  const result = {};

  while (position < code.length) {
    // Ensure we have at least 2 characters left to read the identifier
    if (position + 2 > code.length) {
      throw new Error('Invalid GS1 code: unexpected end of input');
    }

    const identifier = code.substring(position, position + 2);
    const aiInfo = AI[identifier];

    if (!aiInfo) {
      throw new Error(`Unknown Application Identifier: ${identifier}`);
    }

    position += 2;
    
    if (aiInfo.length) {
      // Fixed length
      if (position + aiInfo.length > code.length) {
        throw new Error(`Invalid GS1 code: insufficient data for AI ${identifier}`);
      }

      const value = code.substring(position, position + aiInfo.length);
      position += aiInfo.length;

      if (identifier === '01') {
        result['GTIN'] = value;
      } else if (identifier === '17') {
        // Validate date components
        const year = value.substring(0, 2);
        const month = value.substring(2, 4);
        const day = value.substring(4, 6);

        if (!isValidDate(year, month, day)) {
          throw new Error('Invalid expiration date format');
        }

        result['Expiration Date'] = `${day}/${month}/${year}`;
      }
    } else {
      // Variable length - find next AI or end of string
      let endPosition = code.length;
      for (let i = position + 1; i < code.length; i++) {
        if (AI[code.substring(i, i + 2)]) {
          endPosition = i;
          break;
        }
      }
      
      const value = code.substring(position, endPosition);
      
      // Validate that we got some value
      if (!value) {
        throw new Error(`Invalid GS1 code: empty value for AI ${identifier}`);
      }

      position = endPosition;

      if (identifier === '10') {
        result['Lot Number'] = value;
      } else if (identifier === '21') {
        result['Serial Number'] = value;
      } else if (identifier === '71') {
        result['NHRN - Spain CN'] = value;
      }
    }
  }

  return result;
}

function isValidDate(year, month, day) {
  // Convert to numbers
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  // Basic range checks
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  // Check days in month
  const daysInMonth = new Date(2000 + y, m, 0).getDate();
  return d <= daysInMonth;
}
