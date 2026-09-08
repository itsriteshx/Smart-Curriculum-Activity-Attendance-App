/**
 * @file farmerController.js
 * @description Controller managing Farmer Agricultural Profiles.
 * Handles profile creation, profile retrieval, profile updates, and completion analytics.
 * 
 * Viva tip:
 * What does populate('userId') do?
 * In MongoDB, documents are linked by ObjectId references.
 * Mongoose's .populate() is equivalent to a SQL JOIN—it automatically replaces the referenced
 * userId with the actual user document from the 'users' collection!
 */

const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/messages');

/**
 * @route   POST /api/farmer/profile
 * @desc    Create a new farmer profile for logged-in user
 * @access  Private (Requires Bearer token)
 */
const createProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if farmer profile already exists for this user
    const existingProfile = await Farmer.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.PROFILE_EXISTS,
        farmerId: existingProfile._id,
      });
    }

    const { location, farmSize, soilType, waterAvailability, cropsGrown } = req.body;

    // Create the farmer profile
    const farmer = new Farmer({
      userId,
      location: location || {},
      farmSize,
      soilType,
      waterAvailability: waterAvailability || 'irrigated',
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : [],
    });

    // Check completion
    const completion = farmer.calculateCompletion();
    farmer.profileCompleted = completion.isComplete;

    await farmer.save();

    // Populate user info for rich response
    await farmer.populate('userId', 'fullName email phoneNumber language_preference');

    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_CREATED,
      farmer,
      completionScore: completion.percentage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/farmer/me
 * @desc    Get the profile of currently logged-in farmer
 * @access  Private
 */
const getMyProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id }).populate(
      'userId',
      'fullName email phoneNumber language_preference userRole'
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    const completion = farmer.calculateCompletion();

    return res.status(200).json({
      success: true,
      farmer,
      completion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/farmer/profile/:farmerId
 * @desc    Get farmer profile by Farmer ID (or User ID fallback)
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    // Allow lookup either by Farmer._id OR by Farmer.userId
    let farmer = await Farmer.findById(farmerId).populate(
      'userId',
      'fullName email phoneNumber language_preference userRole'
    );

    if (!farmer) {
      farmer = await Farmer.findOne({ userId: farmerId }).populate(
        'userId',
        'fullName email phoneNumber language_preference userRole'
      );
    }

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    const completion = farmer.calculateCompletion();

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_FETCHED,
      farmer,
      completion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/farmer/profile/:farmerId
 * @desc    Update farmer profile details
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { farmerId } = req.params;
    const updateData = req.body;

    // Prevent direct alteration of userId reference
    delete updateData.userId;

    let farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      farmer = await Farmer.findOne({ userId: farmerId });
    }

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    // Authorization: only the owner or an admin/officer can update
    if (
      farmer.userId.toString() !== req.user._id.toString() &&
      req.user.userRole !== 'admin' &&
      req.user.userRole !== 'officer'
    ) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      });
    }

    // Merge updates
    if (updateData.farmSize !== undefined) farmer.farmSize = updateData.farmSize;
    if (updateData.soilType !== undefined) farmer.soilType = updateData.soilType;
    if (updateData.waterAvailability !== undefined) farmer.waterAvailability = updateData.waterAvailability;
    if (updateData.location) {
      farmer.location = { ...farmer.location.toObject(), ...updateData.location };
    }
    if (Array.isArray(updateData.cropsGrown)) {
      farmer.cropsGrown = updateData.cropsGrown;
    }

    // Recalculate completion
    const completion = farmer.calculateCompletion();
    farmer.profileCompleted = completion.isComplete;

    await farmer.save();
    await farmer.populate('userId', 'fullName email phoneNumber language_preference');

    return res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      farmer,
      completion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/farmer/profile/:farmerId/completion
 * @desc    Get detailed completion percentage and missing profile fields
 * @access  Private
 */
const getProfileCompletion = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    let farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      farmer = await Farmer.findOne({ userId: farmerId });
    }

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    const missingFields = [];
    if (!farmer.farmSize) missingFields.push('farmSize (Acres)');
    if (!farmer.soilType) missingFields.push('soilType');
    if (!farmer.waterAvailability) missingFields.push('waterAvailability');
    if (!farmer.location || !farmer.location.state) missingFields.push('location.state');
    if (!farmer.location || !farmer.location.district) missingFields.push('location.district');
    if (!farmer.location || typeof farmer.location.latitude !== 'number') missingFields.push('location.latitude');
    if (!farmer.location || typeof farmer.location.longitude !== 'number') missingFields.push('location.longitude');
    if (!farmer.cropsGrown || farmer.cropsGrown.length === 0) missingFields.push('cropsGrown (at least 1 crop)');

    const completion = farmer.calculateCompletion();

    return res.status(200).json({
      success: true,
      farmerId: farmer._id,
      completionPercentage: completion.percentage,
      isComplete: completion.isComplete,
      missingFields,
      actionableTips: missingFields.length > 0
        ? `Complete remaining fields (${missingFields.join(', ')}) to receive highly personalized crop advisory!`
        : 'All farm parameters are filled. Personalized agricultural intelligence is fully enabled!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getProfile,
  getMyProfile,
  updateProfile,
  getProfileCompletion,
};
