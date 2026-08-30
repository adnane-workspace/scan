import { asyncHandler } from '../middleware/asyncHandler.js';
import { listTrialLeads, populateFromTemplate, resetTrialCafe, startTrial } from '../services/trial.service.js';

export const startTrialSession = asyncHandler(async (req, res) => {
  const result = await startTrial(req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Trial started',
    data: result,
  });
});

export const getTrialLeads = asyncHandler(async (_req, res) => {
  const leads = await listTrialLeads();

  res.status(200).json({
    success: true,
    data: { leads },
  });
});

export const populateCafeContent = asyncHandler(async (req, res) => {
  const cafe = await populateFromTemplate(req.validated.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Cafe populated from template',
    data: { cafe },
  });
});

export const resetCafeTrial = asyncHandler(async (req, res) => {
  const cafe = await resetTrialCafe(req.validated.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Trial cafe reset',
    data: { cafe },
  });
});
