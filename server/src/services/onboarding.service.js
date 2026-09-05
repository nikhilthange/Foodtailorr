// Partner Onboarding Service — multi-step registration matching Google Form
import { onboardingRepository, partnerRepository, userRepository } from '../repositories/dynamodb/index.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getOnboardingStatus(userId) {
  const application = await onboardingRepository.findByUserId(userId);
  const partner = await partnerRepository.findByUserId(userId);

  return {
    application: application || null,
    partner: partner || null,
    isApproved: partner?.isApproved === true,
    status: application?.status || (partner?.isApproved ? 'APPROVED' : 'NOT_STARTED'),
    draftStep: application?.draftStep || 1,
  };
}

export async function saveDraft(userId, { draftStep, formData }) {
  return onboardingRepository.saveDraft(userId, { draftStep, formData });
}

export async function submitOnboarding(userId, formData) {
  // Validate minimum required fields before final submission
  const required = [
    'restaurantName',
    'restaurantType',
    'city',
    'companyAddress',
    'contactNumber',
    'noOfOutlets',
    'googleMapsLocation',
    'ownerName',
    'designation',
    'mobileNumber',
    'emailId',
    'fssaiNumber',
    'panNumber',
    'signatureDishes',
  ];

  const missing = required.filter(f => !formData[f]);
  if (missing.length > 0) {
    throw new AppError(`Missing required onboarding fields: ${missing.join(', ')}`, 400);
  }

  // Update or create partner profile if not already existing
  let partner = await partnerRepository.findByUserId(userId);
  if (!partner) {
    partner = await partnerRepository.create({
      userId,
      businessName: formData.restaurantName,
      cuisine: formData.restaurantType || 'General',
      description: `Signature dishes: ${formData.signatureDishes}`,
      serviceAreas: [formData.city || 'Hyderabad'],
      isApproved: false,
      isActive: true,
    });
  } else {
    await partnerRepository.update(partner.id, {
      businessName: formData.restaurantName,
      cuisine: formData.restaurantType || partner.cuisine,
      serviceAreas: [formData.city || 'Hyderabad'],
    });
  }

  const application = await onboardingRepository.submit(userId, {
    ...formData,
    partnerId: partner.id,
  });

  return {
    success: true,
    status: 'PENDING_REVIEW',
    application,
    partner,
  };
}

export async function listApplications({ page = 1, limit = 20, status, search } = {}) {
  return onboardingRepository.listAll({ page, limit, status, search });
}

export async function reviewApplication(id, { status, reviewerNotes, reviewedBy }) {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new AppError('Invalid review status. Must be APPROVED or REJECTED', 400);
  }

  const application = await onboardingRepository.findById(id);
  if (!application) {
    throw new AppError('Onboarding application not found', 404);
  }

  const updated = await onboardingRepository.updateStatus(id, {
    status,
    reviewedBy,
    reviewerNotes,
  });

  // If approved, mark the partner as approved!
  if (status === 'APPROVED' && application.userId) {
    const partner = await partnerRepository.findByUserId(application.userId);
    if (partner) {
      await partnerRepository.update(partner.id, {
        isApproved: true,
        isActive: true,
      });
    }
  }

  return updated;
}
