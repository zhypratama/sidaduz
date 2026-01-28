<?php

namespace App\Services;

use App\Models\AppSetting;
use App\Models\WhatsappLog; // We need to create this model too
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    protected $apiKey;
    protected $endpoint;
    protected $header;

    public function __construct()
    {
        // Default to local gateway
        $this->endpoint = AppSetting::where('key', 'wa_endpoint')->value('value') ?? 'http://localhost:3000/send';
        $this->header = AppSetting::where('key', 'wa_default_message_header')->value('value') ?? "*[SIDADU NOTIFICATION]*\n\n";
    }

    /**
     * Send WhatsApp Message
     *
     * @param string $number
     * @param string $message
     * @param string $type
     * @return array
     */
    public function send($number, $message, $type = 'notification')
    {
        $number = $this->formatNumber($number);
        
        // Generate Unique Ref Token (18 chars mixed case)
        $token = \Illuminate\Support\Str::random(18);
        $footer = "\n\n_Ref: #{$token}_";
        
        $fullMessage = $this->header . $message . $footer;

        // Log entry
        $log = WhatsappLog::create([
            'recipient_number' => $number,
            'message' => $fullMessage,
            'status' => 'pending',
            'type' => $type,
        ]);

        try {
            // Local Self-Hosted API Structure
            $response = Http::post($this->endpoint, [
                'number' => $number,
                'message' => $fullMessage,
            ]);

            $responseBody = $response->body();
            $success = $response->json('status') === 'success';

            $log->update([
                'status' => $success ? 'sent' : 'failed',
                'response_log' => $responseBody,
            ]);

            return [
                'status' => $success,
                'response' => $response->json()
            ];

        } catch (\Exception $e) {
            Log::error('WhatsApp Error: ' . $e->getMessage());
            
            $log->update([
                'status' => 'failed',
                'response_log' => $e->getMessage(),
            ]);

            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

    private function formatNumber($number)
    {
        $number = preg_replace('/[^0-9]/', '', $number); 
        // Baileys/Local Gateway script handles 08 -> 62 conversion too, but good to keep here for consistency
        if (substr($number, 0, 2) === '08') {
            return '62' . substr($number, 1);
        }
        return $number;
    }
}
