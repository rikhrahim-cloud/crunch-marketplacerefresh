// This file goes in your GitHub repo at: /api/send-email.js

import { Resend } from 'resend';

// Replace with YOUR Resend API key
const resend = new Resend('re_YOUR_API_KEY_HERE');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { type, booking } = req.body;
    
    // Prepare email content based on type
    let subject = '';
    let html = '';
    let to = '';
    
    if (type === 'new_booking') {
        // Email to provider about new booking
        subject = '🔔 New Booking Request - CRUNCH';
        to = booking.provider_email;
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #000;">New Booking Request!</h2>
                <p>You have a new booking request on CRUNCH.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service:</strong> ${booking.service}</p>
                    <p><strong>Date:</strong> ${booking.date}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Duration:</strong> ${booking.hours} hour(s)</p>
                    <p><strong>Location:</strong> ${booking.address}</p>
                    <p><strong>Amount:</strong> ${booking.amount} CFA</p>
                </div>
                
                <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
                    <p><strong>Customer Details:</strong></p>
                    <p><strong>Name:</strong> ${booking.customer_name}</p>
                    <p><strong>Phone:</strong> ${booking.customer_phone}</p>
                </div>
                
                <p style="margin-top: 30px;">
                    <a href="https://your-crunch-site.vercel.app" 
                       style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View on CRUNCH
                    </a>
                </p>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated email from CRUNCH. Please do not reply to this email.
                </p>
            </div>
        `;
    } else if (type === 'booking_confirmed') {
        // Email to customer when booking is confirmed
        subject = '✅ Booking Confirmed - CRUNCH';
        to = booking.customer_email;
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Booking Confirmed!</h2>
                <p>Your booking has been confirmed by the provider.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service:</strong> ${booking.service}</p>
                    <p><strong>Date:</strong> ${booking.date}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Location:</strong> ${booking.address}</p>
                    <p><strong>Amount:</strong> ${booking.amount} CFA</p>
                </div>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
                    <p><strong>Provider Details:</strong></p>
                    <p><strong>Name:</strong> ${booking.provider_name}</p>
                    <p><strong>Phone:</strong> ${booking.provider_phone}</p>
                </div>
                
                <p style="margin-top: 30px;">The provider will contact you soon to finalize details.</p>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated email from CRUNCH.
                </p>
            </div>
        `;
    } else if (type === 'booking_completed') {
        // Email to both when job is completed
        subject = '🎉 Booking Completed - CRUNCH';
        to = booking.customer_email;
        html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Service Completed!</h2>
                <p>Your booking has been marked as completed.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service:</strong> ${booking.service}</p>
                    <p><strong>Provider:</strong> ${booking.provider_name}</p>
                    <p><strong>Amount:</strong> ${booking.amount} CFA</p>
                </div>
                
                <p>We hope you're satisfied with the service!</p>
                
                <p style="margin-top: 30px;">
                    <a href="https://your-crunch-site.vercel.app" 
                       style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Leave a Review
                    </a>
                </p>
            </div>
        `;
    }
    
    // Send the email
    try {
        const data = await resend.emails.send({
            from: 'CRUNCH <noreply@resend.dev>', // Or your domain
            to: to,
            subject: subject,
            html: html,
        });
        
        return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: error.message });
    }
}
