# Batch cleanup script to remove English and Spanish language links, buttons, language switcher UI, and related JS blocks
Get-ChildItem -Path "c:/Users/alexl/Downloads/DEV 2026/pombagiras-mae" -Recurse -Filter *.html | ForEach-Object {
    $file = $_.FullName
    try {
        $content = Get-Content -Raw -Path $file
        # Remove alternate hreflang links
        $content = $content -replace '<link rel="alternate" hreflang="en"[^>]*>', ''
        $content = $content -replace '<link rel="alternate" hreflang="es"[^>]*>', ''
        # Remove language buttons
        $content = $content -replace '<button[^>]*id="ls-en"[^>]*>EN</button>', ''
        $content = $content -replace '<button[^>]*id="ls-es"[^>]*>ES</button>', ''
        # Remove language switcher container
        $content = $content -replace '<div class="lang-switcher"[\s\S]*?</div>', ''
        # Remove JS block that sets language label based on path (simple heuristic)
        $content = $content -replace '(// Set current language button label based on path[\s\S]*?\})', ''
        Set-Content -Path $file -Value $content -Encoding UTF8
    } catch {
        Write-Host "Failed to process $file - $_"
    }
}
