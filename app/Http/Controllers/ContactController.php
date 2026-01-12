<?php

namespace App\Http\Controllers;

use App\Mail\ContactAdminNotification;
use App\Mail\ContactSenderConfirmation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index()
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle the contact form submission.
     */
    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'country' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Send email to admin
        $adminEmail = config('contact.admin_email', 'hello@buildyourbooth.net');
        Mail::to($adminEmail)->send(new ContactAdminNotification($validated));

        // Send confirmation email to sender
        Mail::to($validated['email'])->send(new ContactSenderConfirmation($validated));

        return back()->with('success', 'Your message has been sent successfully!');
    }
}
