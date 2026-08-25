import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  generateCafeQr,
  listQrChangeRequests,
  requestQrChange,
  reviewQrChangeRequest,
  unlockCafeQr,
} from '../services/qr.service.js';

export const generateQr = asyncHandler(async (req, res) => {
  const qr = await generateCafeQr(req.user);

  res.status(200).json({
    success: true,
    message: 'QR code generated',
    data: { qr },
  });
});

export const createQrChangeRequest = asyncHandler(async (req, res) => {
  const qr = await requestQrChange(req.user, req.validated.body.reason);

  res.status(201).json({
    success: true,
    message: 'QR change request sent',
    data: { qr },
  });
});

export const listQrRequests = asyncHandler(async (req, res) => {
  const result = await listQrChangeRequests(req.validated?.query?.status || req.query.status);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const reviewQrRequest = asyncHandler(async (req, res) => {
  const request = await reviewQrChangeRequest(req.validated.params.id, req.validated.body, req.user);

  res.status(200).json({
    success: true,
    message: 'QR change request reviewed',
    data: { request },
  });
});

export const unlockQr = asyncHandler(async (req, res) => {
  const qr = await unlockCafeQr(req.validated.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'QR change unlocked',
    data: { qr },
  });
});
