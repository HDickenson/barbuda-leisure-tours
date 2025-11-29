// Barbuda Leisure - Pricing Calculator Example
// Demonstrates how to use structured pricing fields for calculations

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tours = JSON.parse(readFileSync(join(__dirname, '../data/tours.json'), 'utf-8'));

/**
 * Calculate total price for a tour booking
 * @param {string} tourSlug - Tour identifier
 * @param {object} booking - Booking details
 * @returns {object} Price breakdown
 */
export function calculateTourPrice(tourSlug, booking) {
  const tour = tours.find(t => t.slug === tourSlug);
  if (!tour) throw new Error(`Tour not found: ${tourSlug}`);

  const pricing = tour.pricing;
  let subtotal = 0;
  const breakdown = {
    tour: tour.title,
    currency: pricing.currency || 'USD',
    guests: [],
    baseSubtotal: 0,
    upgrades: [],
    upgradesSubtotal: 0,
    deposit: 0,
    total: 0
  };

  // Handle different pricing structures
  if (booking.transportMode && pricing[booking.transportMode]) {
    // Multi-transport tours (e.g., Beach Escape)
    const transportPricing = pricing[booking.transportMode];
    
    if (booking.adults) {
      const adultPrice = transportPricing.adult * booking.adults;
      breakdown.guests.push({
        type: 'Adults',
        count: booking.adults,
        priceEach: transportPricing.adult,
        total: adultPrice
      });
      subtotal += adultPrice;
    }
    
    if (booking.children) {
      const childPrice = transportPricing.child * booking.children;
      breakdown.guests.push({
        type: 'Children (2-12)',
        count: booking.children,
        priceEach: transportPricing.child,
        total: childPrice
      });
      subtotal += childPrice;
    }
    
    if (booking.infants) {
      const infantPrice = transportPricing.infant * booking.infants;
      breakdown.guests.push({
        type: 'Infants (under 2)',
        count: booking.infants,
        priceEach: transportPricing.infant,
        total: infantPrice
      });
      subtotal += infantPrice;
    }
  } else {
    // Standard per-person pricing
    if (booking.adults && pricing.adult) {
      const adultPrice = pricing.adult * booking.adults;
      breakdown.guests.push({
        type: 'Adults (13+)',
        count: booking.adults,
        priceEach: pricing.adult,
        total: adultPrice
      });
      subtotal += adultPrice;
    }
    
    // Handle different child age brackets
    if (booking.children) {
      const childPriceKey = pricing.child_6_12 ? 'child_6_12' : 
                           pricing.child_5_12 ? 'child_5_12' : 
                           'child';
      const childPrice = pricing[childPriceKey];
      
      if (childPrice) {
        const total = childPrice * booking.children;
        breakdown.guests.push({
          type: childPriceKey === 'child_6_12' ? 'Children (6-12)' : 
                childPriceKey === 'child_5_12' ? 'Children (5-12)' : 
                'Children (2-12)',
          count: booking.children,
          priceEach: childPrice,
          total: total
        });
        subtotal += total;
      }
    }
    
    if (booking.youngChildren && pricing.child_3_5) {
      const youngChildPrice = pricing.child_3_5 * booking.youngChildren;
      breakdown.guests.push({
        type: 'Children (3-5)',
        count: booking.youngChildren,
        priceEach: pricing.child_3_5,
        total: youngChildPrice
      });
      subtotal += youngChildPrice;
    }
    
    if (booking.infants && pricing.infant) {
      const infantPrice = pricing.infant * booking.infants;
      breakdown.guests.push({
        type: 'Infants (under 2)',
        count: booking.infants,
        priceEach: pricing.infant,
        total: infantPrice
      });
      subtotal += infantPrice;
    }
  }

  breakdown.baseSubtotal = subtotal;

  // Calculate meal/lunch upgrades
  const totalGuests = (booking.adults || 0) + (booking.children || 0) + 
                     (booking.youngChildren || 0) + (booking.infants || 0);

  if (booking.mealUpgrades && pricing.mealUpgrades) {
    Object.entries(booking.mealUpgrades).forEach(([meal, count]) => {
      if (pricing.mealUpgrades[meal]) {
        const upgradeTotal = pricing.mealUpgrades[meal] * count;
        breakdown.upgrades.push({
          type: `${meal.charAt(0).toUpperCase() + meal.slice(1)} Upgrade`,
          count: count,
          priceEach: pricing.mealUpgrades[meal],
          total: upgradeTotal
        });
        breakdown.upgradesSubtotal += upgradeTotal;
      }
    });
  }

  if (booking.lunchUpgrades && pricing.lunchUpgrades) {
    Object.entries(booking.lunchUpgrades).forEach(([item, count]) => {
      if (pricing.lunchUpgrades[item]) {
        const upgradeTotal = pricing.lunchUpgrades[item] * count;
        breakdown.upgrades.push({
          type: item === 'grilledLobster' ? 'Grilled Lobster' : 'Grilled Chicken Wings',
          count: count,
          priceEach: pricing.lunchUpgrades[item],
          total: upgradeTotal
        });
        breakdown.upgradesSubtotal += upgradeTotal;
      }
    });
  }

  // Calculate deposit if applicable
  if (pricing.deposit) {
    breakdown.deposit = pricing.deposit * totalGuests;
  }

  breakdown.total = breakdown.baseSubtotal + breakdown.upgradesSubtotal;

  return breakdown;
}

/**
 * Format price breakdown for display
 */
export function formatPriceBreakdown(breakdown) {
  let output = `\n=== ${breakdown.tour} ===\n\n`;
  
  output += 'GUESTS:\n';
  breakdown.guests.forEach(guest => {
    output += `  ${guest.count}x ${guest.type} @ ${breakdown.currency}$${guest.priceEach} = ${breakdown.currency}$${guest.total}\n`;
  });
  
  output += `\nBase Subtotal: ${breakdown.currency}$${breakdown.baseSubtotal}\n`;
  
  if (breakdown.upgrades.length > 0) {
    output += '\nUPGRADES:\n';
    breakdown.upgrades.forEach(upgrade => {
      output += `  ${upgrade.count}x ${upgrade.type} @ ${breakdown.currency}$${upgrade.priceEach} = ${breakdown.currency}$${upgrade.total}\n`;
    });
    output += `\nUpgrades Subtotal: ${breakdown.currency}$${breakdown.upgradesSubtotal}\n`;
  }
  
  if (breakdown.deposit > 0) {
    output += `\nDeposit Required: ${breakdown.currency}$${breakdown.deposit}\n`;
  }
  
  output += `\n--- TOTAL: ${breakdown.currency}$${breakdown.total} ---\n`;
  
  return output;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

// Example 1: Discover Barbuda by Air with meal upgrades
const airBooking = {
  adults: 2,
  children: 1,
  infants: 0,
  mealUpgrades: {
    lobster: 2,  // 2 lobster upgrades
    fish: 1      // 1 fish upgrade
  }
};

console.log(formatPriceBreakdown(
  calculateTourPrice('discover-barbuda-by-air', airBooking)
));

// Example 2: Beach Escape by helicopter
const beachEscapeBooking = {
  transportMode: 'byHelicopter',
  adults: 4,
  children: 2,
  infants: 0
};

console.log(formatPriceBreakdown(
  calculateTourPrice('barbuda-beach-escape', beachEscapeBooking)
));

// Example 3: Shared Boat Charter with lunch upgrades
const charterBooking = {
  adults: 2,
  children: 1,    // 6-12 years
  youngChildren: 1, // 3-5 years
  infants: 0,
  lunchUpgrades: {
    grilledLobster: 3
  }
};

console.log(formatPriceBreakdown(
  calculateTourPrice('shared-barbuda-boat-charter', charterBooking)
));

// Example 4: Private Yacht (custom pricing)
const yachtTour = tours.find(t => t.slug === 'barbuda-exclusive-yacht-adventure');
console.log(`\n=== ${yachtTour.title} ===`);
console.log(`Type: ${yachtTour.pricing.type}`);
console.log(`Starting at: ${yachtTour.pricing.currency}$${yachtTour.pricing.startingAt}`);
console.log(`Note: ${yachtTour.pricing.note}\n`);
