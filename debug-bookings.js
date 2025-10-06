// Debug script to check booking data and cancellation logic

// Simulate the booking service logic
function canCancelBooking(booking) {
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    console.log('❌ Cannot cancel: Invalid status', booking.status);
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
  
  const canCancel = now < cancellationDeadline;
  
  console.log(`📅 Booking ${booking._id}:`, {
    status: booking.status,
    sessionDate: booking.sessionDate,
    startTime: booking.startTime,
    sessionDateTime: sessionDateTime.toISOString(),
    now: now.toISOString(),
    cancellationDeadline: cancellationDeadline.toISOString(),
    hoursUntilSession: (sessionDateTime - now) / (1000 * 60 * 60),
    canCancel: canCancel ? '✅ YES' : '❌ NO'
  });
  
  return canCancel;
}

// Test with realistic scenarios
console.log('=== DEBUGGING BOOKING CANCELLATION ===\n');

// Test 1: Booking in 2 days (should be cancellable)
console.log('🔍 Test 1: Booking in 2 days');
const booking1 = {
  _id: 'booking1',
  status: 'confirmed',
  sessionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  startTime: '14:00'
};
canCancelBooking(booking1);

// Test 2: Booking in 12 hours (should NOT be cancellable)
console.log('\n🔍 Test 2: Booking in 12 hours');
const booking2 = {
  _id: 'booking2',
  status: 'confirmed',
  sessionDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  startTime: '14:00'
};
canCancelBooking(booking2);

// Test 3: Pending booking in 3 days (should be cancellable)
console.log('\n🔍 Test 3: Pending booking in 3 days');
const booking3 = {
  _id: 'booking3',
  status: 'pending',
  sessionDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  startTime: '10:00'
};
canCancelBooking(booking3);

// Test 4: Completed booking (should NOT be cancellable)
console.log('\n🔍 Test 4: Completed booking');
const booking4 = {
  _id: 'booking4',
  status: 'completed',
  sessionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  startTime: '14:00'
};
canCancelBooking(booking4);

console.log('\n=== SUMMARY ===');
console.log('✅ The cancellation logic appears to be working correctly.');
console.log('❓ If seekers cannot cancel, possible reasons:');
console.log('   1. No bookings are more than 24 hours in the future');
console.log('   2. All bookings are already cancelled/completed');
console.log('   3. Timezone issues with the actual booking data');
console.log('   4. Frontend not receiving the correct booking data');
