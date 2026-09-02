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

export const getTrialLeads = asyncHandler(async (req, res) => {
  const result = await listTrialLeads(req.validated?.query || req.query);

  res.status(200).json({
    success: true,
    data: {
      leads: result.items,
      pagination: result.pagination,
    },
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
