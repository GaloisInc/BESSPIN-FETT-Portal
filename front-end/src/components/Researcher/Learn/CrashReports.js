import React from 'react';

export default function CrashReports() {
  return (
    <div className="pt-6 pb-12 pl-12 pr-12 overflow-y-scroll fettScroll" style={{ height: '85vh' }}>
      <h3 className="text-gray-200 uppercase">Crash Reports</h3>
      <p className="pt-4 text-gray-200 ">
        The purpose of this document is to give explicit criteria to help researchers understand when one of the SSITH
        processors they are exploring has entered a crashed or inconsistent state.
      </p>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">LMCO - chisel_p1 - FreeRTOS</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          A failed application can be detected by failure to respond to either TFTP or HTTP requests.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          In particular a TFTP client will report a time-out. For example:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$ tftp -m binary 172.16.0.2 -c put ota.htm.sig</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>client: timed out</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$</code>
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          An HTTP client will respond with either a time-out or "No route to host" message. For example:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$ curl -i http://172.16.0.2:81/ota.htm</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>curl: (7) Failed connect to 172.16.0.2:81; No route to host</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$</code>
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">LMCO - chisel_p2 - Debian</h4>
        <h5 className=" mt-2 font-normal text-gray-200">Kernal Panic</h5>
        <p className="text-sm pt-4 text-gray-200 font-sm">
          On a kernel panic, the instance will immediately become completely unreachable. It will not reboot with its
          current configuration.
        </p>
        <p className=" text-sm pt-4 text-gray-200 font-sm">
          If you are logged in via SSH when this happens, your session will immediately become unresponsive.
        </p>
        <h5 className=" mt-2 font-normal text-gray-200">FETT application crash</h5>
        <p className=" text-sm pt-4 text-gray-200 font-sm">
          Having part of the FETT application stack crash could put the instance in a state that could be described as
          unrecoverable. What this looks like depends on which application crashes.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          If{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          crashes, then the researcher will be completely unable to access any of the voting pages. Any attempted
          connections on ports 80 and 443 will be refused. This can be fixed by restarting the{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          service (
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>systemctl restart nginx.service</code>
          </span>
          )
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          If{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>kfcgi</code>
          </span>{' '}
          crashes and{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          is still running, then it will still be possible to view the static pages on the voting app, but anything
          beyond that like trying to log in will result in a 502.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          can be restarted by root after a crash by running{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>systemctl restart nginx.service</code>
          </span>
          . It is also possible to manually start{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>kfcgi</code>
          </span>{' '}
          by running:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>
            /usr/local/sbin/kfcgi -s /var/www/run/httpd.sock -U www-data -u www-data -p / -- /var/www/cgi-bin/bvrs
            /var/www/data/bvrs.db
          </code>
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">SRI-Cambridge - bluespec_p2 - CheriBSD</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does it respond to ping? If it does, the kernel is going, interrupts are delivering, context switching is
          happy, kernel memory allocation is good, networking works.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does SSH work? If it does, then user processes are operating and can fork further processes, the filesystem
          and storage I/O are probably operational, etc. If the TCP connection opens but the SSH banner never appears,
          that usually means that fork() is broken due to, for example, a deadlock or resource exhaustion.
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          NOTE: Nodes can still be usefully up despite these things failing -- for example, if a node is crash dumping
          after a kernel panic due to a failed exploit on a kernel memory-safety issue, it could be non-responsive
          (including to pings) for a while while all of DRAM is dumped through VirtIO, and then it resets and boots
          again, possibly with a filesystem check.
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">Michigan - chisel_p1 - FreeRTOS</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          A failed application can be detected by failure to respond to HTTP requests.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          This CPU type has a web server running on port 9443, that can be used to check for whether the instance is
          active and healthy.
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          An HTTP client will respond with either a time-out or "No route to host" message. For example
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$ curl -i http://172.16.0.2:9443/help</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>curl: (7) Failed connect to 172.16.0.2:9443; No route to host</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$</code>
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          Additionally, a healthy instance of this CPU type is expected to respond to ping requests, so this can be used
          as another indicator of instance health.
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">MIT - bluespec_p2 - Debian</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does it respond to ping? If it does, the kernel is going, interrupts are delivering, context switching is
          happy, kernel memory allocation is good, networking works.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does SSH work? If it does, then user processes are operating and can fork further processes, the filesystem
          and storage I/O are probably operational, etc. If the TCP connection opens but the SSH banner never appears,
          that usually means that fork() is broken due to, for example, a deadlock or resource exhaustion.
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          NOTE: Nodes can still be usefully up despite these things failing -- for example, if a node is crash dumping
          after a kernel panic due to a failed exploit on a kernel memory-safety issue, it could be non-responsive
          (including to pings) for a while while all of DRAM is dumped through VirtIO, and then it resets and boots
          again, possibly with a filesystem check.
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">GFE - chisel_p1 - FreeRTOS</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          A failed application can be detected by failure to respond to either TFTP or HTTP requests.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          In particular a TFTP client will report a time-out. For example:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$ tftp -m binary 172.16.0.2 -c put ota.htm.sig</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>client: timed out</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$</code>
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          An HTTP client will respond with either a time-out or "No route to host" message. For example:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$ curl -i http://172.16.0.2:81/ota.htm</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>curl: (7) Failed connect to 172.16.0.2:81; No route to host</code>
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>[centos@ip-192-168-0-72 assets]$</code>
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">GFE - chisel_p2 - Debian</h4>
        <h5 className=" mt-2 font-normal text-gray-200">Kernal Panic</h5>
        <p className="text-sm pt-4 text-gray-200 font-sm">
          On a kernel panic, the instance will immediately become completely unreachable. It will not reboot with its
          current configuration.
        </p>
        <p className=" text-sm pt-4 text-gray-200 font-sm">
          If you are logged in via SSH when this happens, your session will immediately become unresponsive.
        </p>
        <h5 className=" mt-2 font-normal text-gray-200">FETT application crash</h5>
        <p className=" text-sm pt-4 text-gray-200 font-sm">
          Having part of the FETT application stack crash could put the instance in a state that could be described as
          unrecoverable. What this looks like depends on which application crashes.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          If{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          crashes, then the researcher will be completely unable to access any of the voting pages. Any attempted
          connections on ports 80 and 443 will be refused. This can be fixed by restarting the{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          service (
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>systemctl restart nginx.service</code>
          </span>
          )
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          If{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>kfcgi</code>
          </span>{' '}
          crashes and{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          is still running, then it will still be possible to view the static pages on the voting app, but anything
          beyond that like trying to log in will result in a 502.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>nginx</code>
          </span>{' '}
          can be restarted by root after a crash by running{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>systemctl restart nginx.service</code>
          </span>
          . It is also possible to manually start{' '}
          <span className="text-gray-600 bg-gray-200 px-1">
            <code>kfcgi</code>
          </span>{' '}
          by running:
        </p>
        <p className=" pl-1 ml-4 text-gray-600 bg-gray-200 text-sm border border-gray-500 border-b-1">
          <code>
            /usr/local/sbin/kfcgi -s /var/www/run/httpd.sock -U www-data -u www-data -p / -- /var/www/cgi-bin/bvrs
            /var/www/data/bvrs.db
          </code>
        </p>
      </div>
      <div className="mt-4">
        <h4 className=" font-normal text-gray-200 border-b">GFE - bluespec_p2 - FreeBSD</h4>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does it respond to ping? If it does, the kernel is going, interrupts are delivering, context switching is
          happy, kernel memory allocation is good, networking works.
        </p>
        <p className="pt-4 text-sm text-gray-200 font-sm">
          Does SSH work? If it does, then user processes are operating and can fork further processes, the filesystem
          and storage I/O are probably operational, etc. If the TCP connection opens but the SSH banner never appears,
          that usually means that fork() is broken due to, for example, a deadlock or resource exhaustion.
        </p>
        <p className="pt-4 text-gray-200 text-sm">
          NOTE: Nodes can still be usefully up despite these things failing -- for example, if a node is crash dumping
          after a kernel panic due to a failed exploit on a kernel memory-safety issue, it could be non-responsive
          (including to pings) for a while while all of DRAM is dumped through VirtIO, and then it resets and boots
          again, possibly with a filesystem check.
        </p>
      </div>
    </div>
  );
}
