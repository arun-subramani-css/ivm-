export const getFirebaseErrorMessage = (error) => {
  switch (error.code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action';
    case 'not-found':
      return 'The requested document was not found';
    case 'already-exists':
      return 'This document already exists';
    case 'resource-exhausted':
      return 'You have exceeded your quota';
    case 'failed-precondition':
      return 'The operation was rejected because the system is not in a state required for the operation\'s execution';
    case 'aborted':
      return 'The operation was aborted';
    case 'out-of-range':
      return 'The operation was attempted past the valid range';
    case 'unimplemented':
      return 'The operation is not implemented or not supported/enabled';
    case 'internal':
      return 'Internal errors';
    case 'unavailable':
      return 'The service is currently unavailable';
    case 'data-loss':
      return 'Unrecoverable data loss or corruption';
    case 'unauthenticated':
      return 'The request does not have valid authentication credentials';
    default:
      return 'An unknown error occurred';
  }
}; 