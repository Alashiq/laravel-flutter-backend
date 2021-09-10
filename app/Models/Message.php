<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    

    protected $with =[
        'receiver'
    ];
    public function receiver(){
        return $this->belongsTo(Receiver::class);
    }


    public function getCreatedAtAttribute()
    {
      Carbon::setlocale("ar");
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
  
    
    public function getUpdatedAtAttribute()
    {
      Carbon::setlocale("ar");
        return Carbon::parse($this->attributes['updated_at'])->diffForHumans();
    }
    protected $fillable = [
        'name',
        'phone',
        'phone',
        'email',
        'receiver_id',
        'content',
    ];
}
