<x-mail::message>
# New Contact Form Submission

Someone has sent a message through the contact form.

## Sender Information

| Field | Details |
|-------|---------|
| **Name** | {{ $data['name'] }} |
| **Email** | {{ $data['email'] }} |
| **Country** | {{ $data['country'] ?? 'Not specified' }} |

## Message Details

**Subject:** {{ $data['subject'] }}

**Message:**
> {{ $data['message'] }}

---

<x-mail::button>
{{ url('/contact') }}
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
