rule SuspiciousPE {
    meta:
        description = "شناسایی فایل‌های اجرایی مشکوک"
        severity = "high"
    strings:
        $mz = "MZ" ascii
        $pe = "PE" ascii
        $import1 = "VirtualAlloc" nocase
        $import2 = "GetProcAddress" nocase
        $import3 = "CreateRemoteThread" nocase
        $import4 = "WriteProcessMemory" nocase
    condition:
        $mz at 0 and $pe at 4 and ( 2 of ($import*) )
}

rule PackedFile {
    meta:
        description = "شناسایی فایل‌های فشرده‌شده توسط پکرها"
        severity = "medium"
    strings:
        $upx = "UPX!" ascii
        $aspack = "ASPack" ascii
        $pecompact = "PECompact" ascii
    condition:
        any of them
}

rule AntiReverseEngineering {
    meta:
        description = "تشخیص روش‌های ضد تحلیل و دیباگ"
        severity = "high"
    strings:
        $debug1 = "IsDebuggerPresent" ascii
        $debug2 = "CheckRemoteDebuggerPresent" ascii
        $debug3 = "NtSetInformationThread" ascii
        $debug4 = "ZwQueryInformationProcess" ascii
        $debug5 = "OutputDebugStringA" ascii
    condition:
        any of them
}

rule ObfuscatedScript {
    meta:
        description = "شناسایی اسکریپت‌های مخرب با obfuscation"
        severity = "medium"
    strings:
        $eval = "eval(" nocase
        $exec = "exec(" nocase
        $b64 = "base64_decode(" nocase
        $cmd = "cmd.exe /c" nocase
        $powershell = "powershell -enc" nocase
    condition:
        any of them
}

rule Shellcode {
    meta:
        description = "تشخیص الگوهای احتمالی شل‌کد"
        severity = "high"
    strings:
        $nop = { 90 90 90 90 90 }
        $jmp = { E9 ?? ?? ?? ?? 90 90 }
        $call = { 68 ?? ?? ?? ?? C3 }
        $mov = { 60 31 C0 64 8B 40 30 }
    condition:
        any of them
}

rule KeyloggerDetection {
    meta:
        description = "شناسایی keylogger ها"
        severity = "high"
    strings:
        $key1 = "GetAsyncKeyState" ascii
        $key2 = "SetWindowsHookExA" ascii
        $key3 = "GetForegroundWindow" ascii
    condition:
        any of them
}

rule RansomwareBehavior {
    meta:
        description = "شناسایی بدافزارهای باج‌افزار"
        severity = "critical"
    strings:
        $ransom1 = "AES" ascii
        $ransom2 = "RSA" ascii
        $ransom3 = "Encrypted_Files" ascii
        $ransom4 = ".locked" ascii
        $ransom5 = "decrypt" ascii
    condition:
        any of them
}

rule NetworkBackdoor {
    meta:
        description = "شناسایی درهای پشتی شبکه‌ای"
        severity = "high"
    strings:
        $net1 = "socket" ascii
        $net2 = "connect" ascii
        $net3 = "bind" ascii
        $net4 = "listen" ascii
    condition:
        2 of them
}

rule CredentialStealer {
    meta:
        description = "تشخیص بدافزارهای سرقت اطلاعات"
        severity = "high"
    strings:
        $steal1 = "username=" ascii
        $steal2 = "password=" ascii
        $steal3 = "credit card=" ascii
    condition:
        any of them
}

rule ExploitCode {
    meta:
        description = "شناسایی الگوهای کد مخرب مرتبط با اکسپلویت‌ها"
        severity = "critical"
    strings:
        $exp1 = "MS08-067" ascii
        $exp2 = "CVE-2021-34527" ascii
        $exp3 = "CVE-2017-0143" ascii
    condition:
        any of them
}

rule MalwareStringPatterns {
    meta:
        description = "شناسایی رشته‌های رایج در بدافزارها"
        severity = "high"
    strings:
        $mal1 = "malware.exe" ascii
        $mal2 = "hacker_tool" ascii
        $mal3 = "trojan" ascii
        $mal4 = "virus" ascii
        $mal5 = "botnet" ascii
    condition:
        any of them
}

rule XORObfuscation {
    meta:
        description = "تشخیص فایل‌هایی که از XOR برای مخفی‌سازی استفاده می‌کنند"
        severity = "high"
    strings:
        $xor1 = { 31 ?? 31 ?? 31 ?? 31 ?? }
        $xor2 = { 35 ?? ?? ?? ?? 35 ?? ?? ?? ?? }
    condition:
        any of them
}

rule ProcessInjection {
    meta:
        description = "شناسایی بدافزارهایی که از تکنیک‌های تزریق به فرآیند استفاده می‌کنند"
        severity = "critical"
    strings:
        $inject1 = "CreateRemoteThread" ascii
        $inject2 = "WriteProcessMemory" ascii
        $inject3 = "OpenProcess" ascii
    condition:
        any of them
}

rule MalwareDomains {
    meta:
        description = "شناسایی ارتباط با دامنه‌های مخرب"
        severity = "high"
    strings:
        $dom1 = ".onion" ascii
        $dom2 = "darkweb" ascii
        $dom3 = "hackersite" ascii
    condition:
        any of them
}
