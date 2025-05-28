const moment = require('moment');

// Validate dates are in DD/MM/YYYY format
function parseDate(dateStr, label) {
  const parsed = moment(dateStr, 'DD/MM/YYYY', true);
  if (!parsed.isValid()) {
    throw new Error(`${label} must be in DD/MM/YYYY format`);
  }
  return parsed;
}

// When modifying 'location', this value must be provided
function validateNewTrip({ location, arrivalDate, departureDate }) {
  if (typeof location !== 'string') {
    throw new Error('Location must be a valid place, not a number or just symbols');
  }

  if (location.trim() === '') {
    throw new Error('Location is required to record a trip');
  }

  const arrival = parseDate(arrivalDate, 'Arrival date');
  const departure = parseDate(departureDate, 'Departure date');

  if (!arrival.isBefore(departure)) {
    throw new Error('What? Are you travelling back in time');
  }

  return {
    location: location.trim(),
    arrivalDate: arrival.toDate(),
    departureDate: departure.toDate(),
  };
}

function validateTripUpdate(updateData, existingTrip) {
  const { location, arrivalDate, departureDate } = updateData;
  const updateFields = {};
  
  if(location !== undefined) {
    if (location.trim() === '') {
      throw new Error ('Location cannot be blank');
    }
    updateFields.location = location.trim();
  }

  let arrival = arrivalDate
    ? parseDate(arrivalDate, 'Arrival date')
    : moment(existingTrip.arrivalDate);

  let departure = departureDate
    ? parseDate(departureDate, 'Departure date')
    : moment(existingTrip.departureDate);

  if (arrivalDate) updateFields.arrivalDate = arrival.toDate();
  if (departureDate) updateFields.departureDate = departure.toDate();

  if (arrival && departure && !arrival.isBefore(departure)) {
    throw new Error('Arrival date must be before departure date');
  }

  return updateFields;
}

module.exports = {
  validateNewTrip,
  validateTripUpdate,
};