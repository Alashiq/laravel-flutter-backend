<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous" />
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/home.css') }}" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <title>إسم الموقع - @yield('title')</title>
</head>

<body>
    <div id="web" dir="rtl">

        <!-- Header -->
        @foreach (config('pages.pages') as $item)

        @if ($item['id'] === $page)
        <a href="{{$item['path']}}" class="text-red-500">{{$item['name']}}</a>
        @else
        <a href="{{$item['path']}}">{{$item['name']}}</a>
        @endif


        @endforeach
        <!-- En Header -->


        @yield('content')
    </div>
    <!-- Js Part -->
    <script src="{{ mix('js/home.js') }}"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>
</body>

</html>