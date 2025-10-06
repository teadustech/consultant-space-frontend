// Test file to debug booking cancellation logic

// Simulate booking data
const testBooking = {
  _id: 'test123',
  status: 'confirmed',
  sessionDate: '2024-12-25T10:00:00.000Z', // Example future date
  startTime: '10:00'
};

// Simulate the canCancelBooking logic
function canCancelBooking(booking) {
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    console.log('Cannot cancel: Invalid status', booking.status);
    return false;
  }

  const now = new Date();
  
  // Create session date time properly
  let sessionDateTime = new Date(booking.sessionDate);
  
  // If the sessionDate doesn't have the time set (only date), set it from startTime
  if (sessionDateTime.getHours() === 0 && sessionDateTime.getMinutes() === 0) {
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    sessionDateTime.setHours(hours, minutes, 0, 0);
  }
  
  // Can cancel up to 24 hours before the session
  const cancellationDeadline = new Date(sessionDateTime.getTime() - 24 * 60 * 60 * 1000);
  
  console.log('Test canCancelBooking check:', {
    bookingId: booking._id,
    now: now.toISOString(),
    sessionDate: booking.sessionDate,
    sessionDateTime: sessionDateTime.toISOString(),
    cancellationDeadline: cancellationDeadline.toISOString(),
    canCancel: now < cancellationDeadline
  });
  
  return now < cancellationDeadline;
}

// Test with different scenarios
console.log('=== Testing Cancellation Logic ===');

// Test 1: Future booking (should be cancellable)
console.log('\nTest 1: Future booking');
const futureBooking = {
  ...testBooking,
  sessionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours from now
};
console.log('Result:', canCancelBooking(futureBooking));

// Test 2: Past booking (should not be cancellable)
console.log('\nTest 2: Past booking');
const pastBooking = {
  ...testBooking,
  sessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
};
console.log('Result:', canCancelBooking(pastBooking));

// Test 3: Booking within 24 hours (should not be cancellable)
console.log('\nTest 3: Booking within 24 hours');
const nearBooking = {
  ...testBooking,
  sessionDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() // 12 hours from now
};
console.log('Result:', canCancelBooking(nearBooking));

// Test 4: Cancelled booking (should not be cancellable)
console.log('\nTest 4: Cancelled booking');
const cancelledBooking = {
  ...testBooking,
  status: 'cancelled',
  sessionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
};
console.log('Result:', canCancelBooking(cancelledBooking));
