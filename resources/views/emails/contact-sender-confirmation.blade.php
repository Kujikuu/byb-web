<x-mail::message>
# Thank You for Reaching Out!

Hi {{ $data['name'] }},

Thank you for contacting us. We have received your message and will get back to you shortly.

## Your Message Details

**Subject:** {{ $data['subject'] }}

**Message:**
> {{ $data['message'] }}

We'll review your inquiry and respond as soon as possible—usually within 24 hours.

---

<x-mail::button>
Visit Our Website
</x-mail::button>

Need immediate assistance? Feel free to reach out to us directly:

- **Email:** hello@buildyourbooth.net
- **WhatsApp:** +966 54 763 9806

Best regards,<br>
The {{ config('app.name') }} Team
</x-mail::message>