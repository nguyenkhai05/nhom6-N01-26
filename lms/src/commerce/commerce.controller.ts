import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommerceService } from './commerce.service.js';
import { AddToCartDto } from './dto/cart.dto.js';
import { ApplyVoucherDto } from './dto/apply-voucher.dto.js';
import { ConfirmTopupDto, CreateTopupDto } from './dto/topup.dto.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { CreateRefundDto, ReviewRefundDto } from './dto/refund.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtPayload } from '../auth/jwt.util.js';

@Controller('commerce')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  // ================= US08: GIỎ HÀNG =================

  @Get('cart')
  getCart(@CurrentUser() user: JwtPayload) {
    return this.commerceService.getCart(user.sub);
  }

  @Post('cart')
  addToCart(@Body() body: AddToCartDto, @CurrentUser() user: JwtPayload) {
    return this.commerceService.addToCart(user.sub, body);
  }

  @Delete('cart/:courseId')
  removeFromCart(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commerceService.removeFromCart(user.sub, courseId);
  }

  @Delete('cart')
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.commerceService.clearCart(user.sub);
  }

  // ================= US09: BÁO GIÁ & VOUCHER =================

  @Post('quote')
  calculateQuote(@Body() body: ApplyVoucherDto, @CurrentUser() user: JwtPayload) {
    return this.commerceService.calculateQuote(user.sub, body.code);
  }

  // ================= US10: VÍ & NẠP TIỀN =================

  @Get('wallet')
  getWallet(@CurrentUser() user: JwtPayload) {
    return this.commerceService.getOrCreateWallet(user.sub);
  }

  @Get('wallet/ledger')
  getWalletLedger(@CurrentUser() user: JwtPayload) {
    return this.commerceService.getWalletLedger(user.sub);
  }

  @Post('topup')
  createTopup(@Body() body: CreateTopupDto, @CurrentUser() user: JwtPayload) {
    return this.commerceService.createTopupRequest(user.sub, body);
  }

  // ================= US11: THANH TOÁN =================

  @Post('checkout')
  checkout(@Body() body: CheckoutDto, @CurrentUser() user: JwtPayload) {
    return this.commerceService.checkoutWithWallet(user.sub, body);
  }

  // ================= US12: ĐƠN HÀNG & HOÀN TIỀN =================

  @Get('orders')
  getMyOrders(@CurrentUser() user: JwtPayload) {
    return this.commerceService.getMyOrders(user.sub);
  }

  @Post('refunds')
  requestRefund(@Body() body: CreateRefundDto, @CurrentUser() user: JwtPayload) {
    return this.commerceService.requestRefund(user.sub, body);
  }

  // ================= US33: QUẢN TRỊ VIÊN ĐỐI SOÁT & DUYỆT =================

  @Post('admin/topups/:id/confirm')
  @Roles('Admin')
  confirmTopup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ConfirmTopupDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commerceService.confirmTopup(id, body, user);
  }

  @Post('admin/refunds/:id/review')
  @Roles('Admin')
  reviewRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReviewRefundDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.commerceService.reviewRefund(id, body, user);
  }

  @Get('admin/orders')
  @Roles('Admin')
  adminOrders() {
    return this.commerceService.adminListOrders();
  }

  @Get('admin/topups')
  @Roles('Admin')
  adminTopups() {
    return this.commerceService.adminListTopups();
  }

  @Get('admin/refunds')
  @Roles('Admin')
  adminRefunds() {
    return this.commerceService.adminListRefunds();
  }

  @Get('admin/ledgers')
  @Roles('Admin')
  adminLedgers() {
    return this.commerceService.adminListLedgers();
  }
}
