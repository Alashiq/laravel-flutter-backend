@extends('home.layouts.master')

@section('title', 'إتصل بنا')

@section('page', '7')

@section('content')


<!-- Contact Form -->
<contact-form :receivers="{{ $receivers }}"></contact-form>
<!-- End Contact Form -->



@endsection('content')