Add-Type -AssemblyName System.Drawing
$src = "C:\Users\thera\OneDrive\Desktop\Claude-Projects\Akash The Band Website\public\Logo 2 with no background.png"
$img = [System.Drawing.Image]::FromFile($src)

$dst32 = "C:\Users\thera\OneDrive\Desktop\Claude-Projects\Akash The Band Website\public\favicon-32.png"
$bmp32 = New-Object System.Drawing.Bitmap(32, 32)
$g32 = [System.Drawing.Graphics]::FromImage($bmp32)
$g32.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g32.DrawImage($img, 0, 0, 32, 32)
$g32.Dispose()
$bmp32.Save($dst32, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp32.Dispose()

$dst512 = "C:\Users\thera\OneDrive\Desktop\Claude-Projects\Akash The Band Website\public\favicon-512.png"
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($img, 0, 0, 512, 512)
$g512.Dispose()
$bmp512.Save($dst512, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Dispose()

$img.Dispose()
Write-Output "Done: 32x32 and 512x512 created"
