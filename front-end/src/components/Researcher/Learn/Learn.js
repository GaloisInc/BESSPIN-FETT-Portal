import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPSUrl } from '../../../services/api/learn';
import settings from '../../../assets/settings.svg';

export default function Learn() {
  const [CVELink, setCVELink] = useState('');
  const [UARTLink, setUARTLink] = useState('');
  const [votingLink, setVotingLink] = useState('');
  const [freeRTOSLink, setFreeRTOSLink] = useState('');
  const [LMCOELFLink, setLMCOELFLink] = useState('');
  const [MichELFLink, setMichELFLink] = useState('');
  const [GFEELFLink, setGFEELFLink] = useState('');

  const populatePSUrl = async (key, callback) => {
    const psUrl = await getPSUrl(key);
    callback(psUrl);
  };

  useEffect(() => {
    populatePSUrl('CVE_Coverage_FETT-Portal_07.07.20.xlsx', setCVELink);
    populatePSUrl('UART piping.docx', setUARTLink);
    populatePSUrl('FETT-Portal.Voter.application.LEARN.content.pdf', setVotingLink);
    populatePSUrl('FreeRTOS.OTA.Application.Description.pdf', setFreeRTOSLink);
    populatePSUrl('live/GFE_FreeRTOS.elf', setGFEELFLink);
    populatePSUrl('live/LMCO_FreeRTOS.elf', setLMCOELFLink);
    populatePSUrl('live/Michigan_FreeRTOS.elf', setMichELFLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-6 pb-12 pl-12 pr-12 fettScroll" style={{ overflowY: 'scroll', height: '85vh' }}>
      <h3 className="text-gray-200 uppercase">Learn</h3>
      <p className="pt-4 text-gray-200">
        This information is provided to help set context and give focus to researchers participating in this bug bounty
        event.
      </p>
      <p className="pt-4 pb-4 text-gray-200 border-b">
        The processors under examination here can be assumed to be in compliance with the GFE specification, outlined{' '}
        <a
          href="https://github.com/GaloisInc/BESSPIN-GFE-2019/blob/master/GFE_Rel4_System_Description.pdf"
          target="_blank"
          className="text-teal-400 underline"
          rel="noopener noreferrer"
        >
          here
        </a>
        . This GFE documentation has concrete specifications for the processors commonly referred to as “P1”, “P2”, and
        “P3” in subsequent documentation under the chapter title “Processor Specifications.”
      </p>

      <div className="pt-6">
        <h4 className="font-normal text-gray-200">Quickstart </h4>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          You can use this website to provision new instances of the various platform combinations and receive
          credentials and connection information for each.
        </p>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          NOTE: You will be limited to a maximum of two (2) active instances at any given time, and instances are
          automatically shut down after being active for eight (8) hours.
        </p>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          NOTE: Provisioning times for the various CPU types vary between ~8 minutes and ~16 minutes.
        </p>
        <Link className="text-teal-400 underline" to="crashreports">
          Detecting crashed SSITH CPUs
        </Link>
      </div>

      <div className="pt-6">
        <h4 className="font-normal text-gray-200">Accessing Instances</h4>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          Once you have provisioned an instance, you will be able to access that instance by clicking the properties
          button ( <img className="inline" src={settings} alt="dials" /> ) in the Dashboard view of this portal. This
          will show you an IP address for the instance that you will be able to access via SSH. The login/password you
          were issued to access{' '}
          <a
            href="http://fett.securehardware.org"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            http://fett.securehardware.org
          </a>{' '}
          can be used to authenticate to the SSH server on your instance.
        </p>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          Notice: Access to UART on all instances is outlined{' '}
          <a href={UARTLink} target="_blank" className="text-teal-400 underline" rel="noopener noreferrer">
            here
          </a>
        </p>
      </div>

      <div className="pt-6 ">
        <h4 className="font-normal text-gray-200">SSITH Processors</h4>
        <h6 className="pt-2 font-normal leading-tight text-gray-200">SRI/Cambridge</h6>
        <ul className="pl-4 list-disc font-normal list-inside text-gray-200 text-sm">
          <li>
            CPU: Bluespec P2 w/CHERI extension
            <ul className="pl-6 list-disc list-inside">
              <li>
                OS:{' '}
                <a
                  href="https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/cheribsd.html"
                  target="_blank"
                  className="text-teal-400 underline"
                  rel="noopener noreferrer"
                >
                  CheriBSD
                </a>
                {` (CHERI-extended FreeBSD)`}
                <ul className="pl-8 list-disc list-inside">
                  <li>
                    Enhanced with a pure-capability kernel providing protection from many spatial memory-safety issues
                  </li>
                </ul>
              </li>
              <li>
                Applications:
                <ul className="pl-8 list-disc list-inside">
                  <li>Web Server (nginx v.1.13.12)</li>
                  <li>Database (sqlite v.3.22.0)</li>
                  <li>SSH Daemon (OpenSSH 7.3)</li>
                  <li>FETT-Voting voter registration application</li>
                  <li>Additional applications modified to incorporate CHERI protections</li>
                  <li>Researcher-provided and compiled vulnerable applications</li>
                  <li>NFS v4 server exporting /</li>
                </ul>
              </li>
              <li>
                Reintroduced kernel vulnerabilities (known to be exploitable on a conventional RISC-V kernel)::
                <ul className="pl-8 list-disc list-inside">
                  <li>
                    <a
                      href="https://www.freebsd.org/security/advisories/FreeBSD-SA-18:13.nfs.asc"
                      target="_blank"
                      className="text-teal-400 underline"
                      rel="noopener noreferrer"
                    >
                      FreeBSD-SA-18:13.nfs
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.freebsd.org/security/advisories/FreeBSD-SA-09%3A06.ktimer.asc"
                      target="_blank"
                      className="text-teal-400 underline"
                      rel="noopener noreferrer"
                    >
                      FreeBSD-SA-09:06.ktimer
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                Security researchers are given access to a root shell to interact with custom applications via "su -"
              </li>
            </ul>
          </li>
          <li>
            FAQ:
            <ul className="pl-8 list-disc list-inside">
              <li>
                You can reboot this instance type with one of the following procedures:
                <ul className="pl-8 list-disc list-inside">
                  <li>Through the ssh connection: Invoke su, then invoke reboot. [Recommended]</li>
                  <li>
                    Through the piped UART on port 8278, Ctrl-a + r may also be used for a hard reset. [Advised to use
                    only when the target is non-responsive.]
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <h6 className="pt-2 leading-tight text-gray-200">Lockheed Martin Corporation</h6>
        <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
          <li>
            CPU: Chisel P1
            <ul className="pl-6 list-disc list-inside">
              <li>
                OS:{' '}
                <a
                  href="https://freertos.org/"
                  target="_blank"
                  className="text-teal-400 underline"
                  rel="noopener noreferrer"
                >
                  FreeRTOS
                </a>
              </li>
              <li>
                Applications:
                <ul className="pl-8 list-disc list-inside">
                  <li>HTTP Server (running on Port 81)</li>
                  <li>OTA update server (see notes below)</li>
                </ul>
              </li>
              <li>
                ELF Binaries:
                <ul className="pl-8 list-disc list-inside">
                  <li>
                    {' '}
                    <a href={LMCOELFLink} download className="text-teal-400 underline" rel="noopener noreferrer">
                      LMCO P1 ELF binaries
                    </a>
                  </li>
                  <li>
                    {' '}
                    <a href={GFEELFLink} download className="text-teal-400 underline" rel="noopener noreferrer">
                      GFE P1 ELF binaries
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            CPU: Chisel P2
            <ul className="pl-6 list-disc list-inside">
              <li>OS: Debian Linux 10.0</li>
              <li>
                Applications:
                <ul className="pl-8 list-disc list-inside">
                  <li>Web Server (nginx v.1.13.12)</li>
                  <li>Database (SQLite v3.22.0)</li>
                  <li>SSH Daemon (OpenSSH 7.3)</li>
                  <li>Custom ‘hackme’ application</li>
                  <li>FETT-Voting voter registration application</li>
                  <li>Researcher-provided and compiled vulnerable applications</li>
                </ul>
              </li>
              <li>Security researchers given access to a root shell to interact with custom applications via "su -"</li>
            </ul>
          </li>
          <li>
            FAQ:
            <ul className="pl-8 list-disc list-inside">
              <li>Content forthcoming if required based on contest activity.</li>
            </ul>
          </li>
        </ul>

        <h6 className="pt-2 leading-tight text-gray-200">University of Michigan MORPHEUS CPU</h6>
        <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
          <li>
            CPU: Chisel P1 w/no MMU use (64-bit physical memory processor)
            <ul className="pl-6 list-disc list-inside">
              <li>
                OS:{' '}
                <a
                  href="https://freertos.org/"
                  target="_blank"
                  className="text-teal-400 underline"
                  rel="noopener noreferrer"
                >
                  FreeRTOS
                </a>
              </li>
              <li>
                Applications:
                <ul className="pl-8 list-disc list-inside">
                  <li>Database (SQLite v3.31.1)</li>
                  <li>Medical database application (uses SQLite v3.31.1 and latest FreeRTOS + modified TCP stack)</li>
                </ul>
              </li>
              <li>
                ELF Binaries:
                <ul className="pl-8 list-disc list-inside">
                  <li>
                    {' '}
                    <a href={MichELFLink} download className="text-teal-400 underline" rel="noopener noreferrer">
                      Michigan P1 ELF binaries
                    </a>
                  </li>
                  <li>
                    {' '}
                    <a href={GFEELFLink} download className="text-teal-400 underline" rel="noopener noreferrer">
                      GFE P1 ELF binaries
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          FAQ:
          <ul className="pl-8 list-disc list-inside">
            <li>More FAQ content forthcoming if required based on contest activity.</li>
          </ul>
        </ul>

        <h6 className="pt-2 leading-tight text-gray-200">MIT</h6>
        <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
          <li>
            CPU: Bluespec P2
            <ul className="pl-6 list-disc list-inside">
              <li>OS: Debian Linux</li>
              <li>
                Applications:
                <ul className="pl-8 list-disc list-inside">
                  <li>Web Server (Nginx v1.13.12)</li>
                  <li>Database (SQLite v3.22.0)</li>
                  <li>SSH Daemon (OpenSSH v7.3)</li>
                  <li>Protected AES engine</li>
                  <li>Protected Password Authentication Module</li>
                </ul>
              </li>
              <li>Security researchers given access to a root shell on system via "su -"</li>
              <li>From a root shell, run "./install-enclaves.sh"</li>
              <li>
                AES enclave is exercised via "/ssith/aes-main option infile outfile" with option "-e" for encrypt and
                "-d" for decrypt.
              </li>
              <li>{'Test PAM enclave via "pamtester testing <username> authenticate."'}</li>
            </ul>
          </li>
          <li>
            FAQ:
            <ul className="pl-8 list-disc list-inside">
              <li>Content forthcoming if required based on contest activity.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="pt-6">
        <h4 className="font-normal text-gray-200">Technical descriptions of SSITH security technologies</h4>
        <p className="pt-2 text-sm leading-tight text-gray-200">
          The target platform is a RISC-V CPU/SoC running Linux, FreeBSD, or FreeRTOS. More details about the underlying
          hardware, firmware, and software platform is found in the{' '}
          <a
            href="https://github.com/GaloisInc/BESSPIN-GFE-2019/"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            GFE project at GitHub
          </a>
          .
        </p>

        <p className="pt-2 text-sm leading-tight text-gray-200">
          <a
            href="https://dl.acm.org/doi/10.1145/3297858.3304037"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            MORPHEUS
          </a>{' '}
          (University of Michigan)
          <br />
        </p>

        <p className="pt-2 text-sm leading-tight text-gray-200">
          <a
            className="text-teal-400 underline"
            href="https://eprint.iacr.org/2015/564.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sanctum/
          </a>
          <a
            className="text-teal-400 underline"
            href="https://people.csail.mit.edu/devadas/pubs/sanctorum.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sanctorum
          </a>{' '}
          (MIT)
        </p>

        <p className="pt-2 text-sm leading-tight text-gray-200">HARD pipelines (LMCO)</p>

        <p className="pt-2 text-sm leading-tight text-gray-200">
          <a
            href="https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            CHERI
          </a>{' '}
          (University of Cambridge / SRI)
        </p>
      </div>

      <div className="pt-6">
        <h5 className="font-normal text-gray-200">Notes on operating systems and applications installed</h5>
        <div className="pt-6">
          <h6 className="font-normal text-gray-200">CVE Coverage across applications and operating systems</h6>
          <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
            <li>
              <a href={CVELink} className="text-teal-400 underline" rel="noopener noreferrer" download>
                CVE Coverage spreadsheet
              </a>
            </li>
          </ul>
        </div>
        <div className="pt-6">
          <h6 className="font-normal text-gray-200">CheriBSD</h6>
          <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
            <li>
              It is possible to run a `reboot` command against CheriBSD targets only. This operation takes approximately
              six minutes to complete.
            </li>
          </ul>
        </div>
        <div className="pt-6">
          <h6 className="font-normal text-gray-200">FreeRTOS</h6>
          <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
            <li>The webserver on this operating system runs on port 81, rather than the more standard port 80.</li>
          </ul>
        </div>
        <div className="pt-6">
          <h6 className="font-normal text-gray-200">FreeRTOS OTA Application</h6>
          <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
            <li>
              Documentation for this application is available here:
              <br />
              <a
                href={freeRTOSLink}
                className="text-teal-400 underline"
                rel="noopener noreferrer"
                download
                target="_blank"
              >
                FreeRTOS OTA description
              </a>
            </li>
            <li>The OTA server uses Ed25519 for signing updates.</li>
          </ul>
        </div>
        <div className="pt-6">
          <h6 className="font-normal text-gray-200">FETT-Voting</h6>
          <ul className="pl-4 list-disc list-inside text-gray-200 text-sm">
            <li>
              Application Description: This application represents the minimum demonstrable implementation of a Voter
              Registration application, intended to run on SSITH hardware. An actual production Voter Registration
              system would have a significantly larger footprint; among other implementation choices, it would be
              implemented with a more full-featured DBMS than SQLite. The application enables users to submit
              registration information and to upload image files intended to contain proof of identity and right to
              vote. It also enables election officials to promote pending voter registrations to active voter
              registrations, and to modify the voter registration database in various ways.
            </li>
            <li>
              In keeping with the real-world threats against voter registration systems, the primary threats we consider
              in scope for FETT are unauthorized disclosure of voter registration information, and unauthorized
              modification or deletion of voter registration information. In particular, because voter registrations are
              typically public information, unauthorized disclosure is defined as one of the following that occurs while
              not properly authenticated to the system as an election official:
              <ul className="pl-8 list-disc list-inside">
                <li>Disclosure of the proof of identity used by any voter at registration time</li>
                <li>
                  Disclosure of any part of a voter registration record that is marked “confidential”, including the
                  fact of its existence
                </li>
              </ul>
              Unauthorized modification or deletion includes any change to voter registration records that occurs while
              not properly authenticated to the system as an election official, except that a voter whose record is not
              marked “confidential” can modify their own record (after which it becomes a pending registration) by
              authenticating to the system with their existing registration information (including the original proof of
              identity they submitted).
            </li>
            <li>
              Direct modification/viewing of the SQLite database file for the voter registration system from the command
              line is explicitly out of scope. FETT researchers have unrestricted access to the filesystem, and the
              encryption and key management associated with protecting the registration database at rest from such
              unrestricted access have significant overhead that is not reasonable for either the FPGA-based
              implementation platform or for the FETT competition.
            </li>
            <li>
              <a href={votingLink} className="text-teal-400 underline" rel="noopener noreferrer" download>
                Design, Security and Threat Modeling for FETT Voter Registration System
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
